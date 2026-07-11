import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { Rol } from '../roles/entities/rol.entity';
import { RefreshToken } from './entities/refresh-token.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
    @InjectRepository(Rol)
    private rolRepository: Repository<Rol>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(
    correoInstitucional: string,
    contrasena: string,
  ): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOne({
      where: { correo_institucional: correoInstitucional },
      relations: ['rol'],
    });

    if (!usuario) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    if (!usuario.activo) {
      throw new UnauthorizedException('Usuario desactivado');
    }

    const contrasenaValida = await bcrypt.compare(
      contrasena,
      usuario.contrasena_hash,
    );

    if (!contrasenaValida) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Actualizar último acceso
    await this.usuarioRepository.update(usuario.id, {
      ultimo_acceso: new Date(),
    });

    return usuario;
  }

  async login(loginDto: LoginDto) {
    const usuario = await this.validateUser(
      loginDto.correo_institucional,
      loginDto.contrasena,
    );

    const tokens = await this.generateTokens(usuario);
    await this.saveRefreshToken(usuario, tokens.refreshToken);

    return {
      access_token: tokens.accessToken,
      refresh_token: tokens.refreshToken,
      usuario: this.sanitizeUsuario(usuario),
    };
  }

  async register(registerDto: RegisterDto) {
    // Verificar si el correo ya existe
    const usuarioExistente = await this.usuarioRepository.findOne({
      where: { correo_institucional: registerDto.correo_institucional },
    });

    if (usuarioExistente) {
      throw new ConflictException('El correo institucional ya está registrado');
    }

    // Verificar si el DNI ya existe
    if (registerDto.dni) {
      const dniExistente = await this.usuarioRepository.findOne({
        where: { dni: registerDto.dni },
      });

      if (dniExistente) {
        throw new ConflictException('El DNI ya está registrado');
      }
    }

    // Obtener rol de estudiante por defecto
    const rolEstudiante = await this.rolRepository.findOne({
      where: { nombre: 'estudiante' },
    });

    if (!rolEstudiante) {
      throw new BadRequestException('Rol de estudiante no encontrado');
    }

    // Hash de contraseña
    const saltRounds = this.configService.get<number>('BCRYPT_ROUNDS', 10);
    const contrasenaHash = await bcrypt.hash(
      registerDto.contrasena,
      saltRounds,
    );

    // Crear usuario
    const usuario = this.usuarioRepository.create({
      id: uuidv4(),
      rol_id: rolEstudiante.id,
      correo_institucional: registerDto.correo_institucional,
      contrasena_hash: contrasenaHash,
      nombres: registerDto.nombres,
      apellido_paterno: registerDto.apellido_paterno,
      apellido_materno: registerDto.apellido_materno,
      dni: registerDto.dni,
      telefono: registerDto.telefono,
      activo: true,
    });

    const usuarioGuardado = await this.usuarioRepository.save(usuario);

    // Generar tokens
    const tokens = await this.generateTokens(usuarioGuardado);
    await this.saveRefreshToken(usuarioGuardado, tokens.refreshToken);

    return {
      access_token: tokens.accessToken,
      refresh_token: tokens.refreshToken,
      usuario: this.sanitizeUsuario(usuarioGuardado),
    };
  }

  async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    const refreshToken = await this.refreshTokenRepository.findOne({
      where: { token: refreshTokenDto.refresh_token },
      relations: ['usuario'],
    });

    if (!refreshToken) {
      throw new UnauthorizedException('Token de refresh inválido');
    }

    if (refreshToken.revocado || refreshToken.expira_en < new Date()) {
      await this.refreshTokenRepository.delete({ id: refreshToken.id });
      throw new UnauthorizedException('Token de refresh expirado o revocado');
    }

    const usuario = await this.usuarioRepository.findOne({
      where: { id: refreshToken.usuario_id },
      relations: ['rol'],
    });

    if (!usuario || !usuario.activo) {
      await this.refreshTokenRepository.delete({ id: refreshToken.id });
      throw new UnauthorizedException('Usuario inválido o desactivado');
    }

    // Revocar token anterior
    await this.refreshTokenRepository.update(
      { id: refreshToken.id },
      { revocado: true },
    );

    // Generar nuevos tokens
    const tokens = await this.generateTokens(usuario);
    await this.saveRefreshToken(usuario, tokens.refreshToken);

    return {
      access_token: tokens.accessToken,
      refresh_token: tokens.refreshToken,
      usuario: this.sanitizeUsuario(usuario),
    };
  }

  async logout(usuarioId: string) {
    await this.refreshTokenRepository.update(
      { usuario_id: usuarioId },
      { revocado: true },
    );
    return { message: 'Sesión cerrada exitosamente' };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const usuario = await this.usuarioRepository.findOne({
      where: { correo_institucional: forgotPasswordDto.correo_institucional },
    });

    if (!usuario) {
      // Por seguridad, no revelamos si el usuario existe
      return {
        message:
          'Si el correo está registrado, recibirás instrucciones para restablecer tu contraseña',
      };
    }

    // Generar token de reset (en producción, enviar por email)
    const resetToken = uuidv4();
    const resetTokenExpira = new Date();
    resetTokenExpira.setHours(resetTokenExpira.getHours() + 1);

    await this.usuarioRepository.update(usuario.id, {
      // En producción, guardar token hash en DB
      // Por ahora, simulamos el proceso
    });

    // TODO: Enviar email con el token de reset
    // await this.emailService.sendPasswordResetEmail(usuario.correo_institucional, resetToken);

    return {
      message:
        'Si el correo está registrado, recibirás instrucciones para restablecer tu contraseña',
      reset_token: resetToken, // Solo para desarrollo
    };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    // En producción, validar el token de reset
    // Por ahora, permitimos el reset directo

    const usuario = await this.usuarioRepository.findOne({
      where: { correo_institucional: resetPasswordDto.correo_institucional },
    });

    if (!usuario) {
      throw new BadRequestException('Usuario no encontrado');
    }

    const saltRounds = this.configService.get<number>('BCRYPT_ROUNDS', 10);
    const contrasenaHash = await bcrypt.hash(
      resetPasswordDto.nueva_contrasena,
      saltRounds,
    );

    await this.usuarioRepository.update(usuario.id, {
      contrasena_hash: contrasenaHash,
    });

    // Revocar todos los refresh tokens del usuario
    await this.refreshTokenRepository.update(
      { usuario_id: usuario.id },
      { revocado: true },
    );

    return { message: 'Contraseña restablecida exitosamente' };
  }

  private async generateTokens(usuario: Usuario) {
    const payload = {
      sub: usuario.id,
      correo: usuario.correo_institucional,
      rol: usuario.rol?.nombre,
    };

    const accessToken = this.jwtService.sign(payload);

    const refreshTokenPayload = {
      sub: usuario.id,
      type: 'refresh',
    };

    const refreshToken = this.jwtService.sign(refreshTokenPayload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN', '7d'),
    });

    return { accessToken, refreshToken };
  }

  private async saveRefreshToken(usuario: Usuario, token: string) {
    const expiraEn = new Date();
    expiraEn.setDate(
      expiraEn.getDate() +
        parseInt(
          this.configService
            .get<string>('JWT_REFRESH_EXPIRES_IN', '7d')
            .replace('d', ''),
        ),
    );

    const refreshTokenEntity = this.refreshTokenRepository.create({
      id: uuidv4(),
      usuario_id: usuario.id,
      token,
      expira_en: expiraEn,
      revocado: false,
    });

    await this.refreshTokenRepository.save(refreshTokenEntity);
  }

  private sanitizeUsuario(usuario: Usuario) {
    const { contrasena_hash, ...sanitized } = usuario;
    return sanitized;
  }

  async getProfile(usuarioId: string) {
    const usuario = await this.usuarioRepository.findOne({
      where: { id: usuarioId },
      relations: ['rol'],
    });

    if (!usuario) {
      throw new BadRequestException('Usuario no encontrado');
    }

    return this.sanitizeUsuario(usuario);
  }
}
