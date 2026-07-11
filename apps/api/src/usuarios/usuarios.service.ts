import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { Usuario } from './entities/usuario.entity';
import { Estudiante } from './entities/estudiante.entity';
import { Asesor } from './entities/asesor.entity';
import { Jurado } from './entities/jurado.entity';
import { Rol } from '../roles/entities/rol.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { CreateEstudianteDto } from './dto/create-estudiante.dto';
import { UpdateEstudianteDto } from './dto/update-estudiante.dto';
import { CreateAsesorDto } from './dto/create-asesor.dto';
import { UpdateAsesorDto } from './dto/update-asesor.dto';
import { CreateJuradoDto } from './dto/create-jurado.dto';
import { UpdateJuradoDto } from './dto/update-jurado.dto';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
    @InjectRepository(Estudiante)
    private estudianteRepository: Repository<Estudiante>,
    @InjectRepository(Asesor)
    private asesorRepository: Repository<Asesor>,
    @InjectRepository(Jurado)
    private juradoRepository: Repository<Jurado>,
    @InjectRepository(Rol)
    private rolRepository: Repository<Rol>,
  ) {}

  async findAllUsuarios() {
    return this.usuarioRepository.find({
      relations: ['rol'],
      select: [
        'id',
        'correo_institucional',
        'nombres',
        'apellido_paterno',
        'apellido_materno',
        'dni',
        'telefono',
        'activo',
        'ultimo_acceso',
        'creado_en',
        'actualizado_en',
      ],
    });
  }

  async findUsuarioById(id: string) {
    const usuario = await this.usuarioRepository.findOne({
      where: { id },
      relations: ['rol'],
    });

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return this.sanitizeUsuario(usuario);
  }

  async createUsuario(createUsuarioDto: CreateUsuarioDto) {
    // Verificar si el correo ya existe
    const usuarioExistente = await this.usuarioRepository.findOne({
      where: { correo_institucional: createUsuarioDto.correo_institucional },
    });

    if (usuarioExistente) {
      throw new ConflictException('El correo institucional ya está registrado');
    }

    // Verificar si el DNI ya existe
    if (createUsuarioDto.dni) {
      const dniExistente = await this.usuarioRepository.findOne({
        where: { dni: createUsuarioDto.dni },
      });

      if (dniExistente) {
        throw new ConflictException('El DNI ya está registrado');
      }
    }

    // Obtener rol
    const rol = await this.rolRepository.findOne({
      where: { nombre: createUsuarioDto.rol_nombre || 'estudiante' },
    });

    if (!rol) {
      throw new BadRequestException('Rol no encontrado');
    }

    // Hash de contraseña
    const saltRounds = 10;
    const contrasenaHash = await bcrypt.hash(
      createUsuarioDto.contrasena,
      saltRounds,
    );

    // Crear usuario
    const usuario = this.usuarioRepository.create({
      id: uuidv4(),
      rol_id: rol.id,
      correo_institucional: createUsuarioDto.correo_institucional,
      contrasena_hash: contrasenaHash,
      nombres: createUsuarioDto.nombres,
      apellido_paterno: createUsuarioDto.apellido_paterno,
      apellido_materno: createUsuarioDto.apellido_materno,
      dni: createUsuarioDto.dni,
      telefono: createUsuarioDto.telefono,
      activo: true,
    });

    const usuarioGuardado = await this.usuarioRepository.save(usuario);

    return this.sanitizeUsuario(usuarioGuardado);
  }

  async updateUsuario(id: string, updateUsuarioDto: UpdateUsuarioDto) {
    const usuario = await this.usuarioRepository.findOne({ where: { id } });

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Si se actualiza el correo, verificar que no exista
    if (
      updateUsuarioDto.correo_institucional &&
      updateUsuarioDto.correo_institucional !== usuario.correo_institucional
    ) {
      const correoExistente = await this.usuarioRepository.findOne({
        where: { correo_institucional: updateUsuarioDto.correo_institucional },
      });

      if (correoExistente) {
        throw new ConflictException('El correo institucional ya está registrado');
      }
    }

    // Si se actualiza el DNI, verificar que no exista
    if (updateUsuarioDto.dni && updateUsuarioDto.dni !== usuario.dni) {
      const dniExistente = await this.usuarioRepository.findOne({
        where: { dni: updateUsuarioDto.dni },
      });

      if (dniExistente) {
        throw new ConflictException('El DNI ya está registrado');
      }
    }

    // Si se actualiza la contraseña, hacer hash
    if (updateUsuarioDto.contrasena) {
      const saltRounds = 10;
      updateUsuarioDto.contrasena = await bcrypt.hash(
        updateUsuarioDto.contrasena,
        saltRounds,
      );
    }

    // Si se actualiza el rol
    let rolId: string | undefined;
    if (updateUsuarioDto.rol_nombre) {
      const rol = await this.rolRepository.findOne({
        where: { nombre: updateUsuarioDto.rol_nombre },
      });

      if (!rol) {
        throw new BadRequestException('Rol no encontrado');
      }

      rolId = rol.id;
    }

    // Eliminar rol_nombre del DTO ya que no es una columna de la base de datos
    const { rol_nombre, ...updateData } = updateUsuarioDto;

    await this.usuarioRepository.update(id, {
      ...updateData,
      rol_id: rolId,
    });

    const usuarioActualizado = await this.usuarioRepository.findOne({
      where: { id },
      relations: ['rol'],
    });

    return this.sanitizeUsuario(usuarioActualizado);
  }

  async activateUsuario(id: string) {
    const usuario = await this.usuarioRepository.findOne({ where: { id } });

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    await this.usuarioRepository.update(id, { activo: true });

    return { message: 'Usuario activado exitosamente' };
  }

  async deactivateUsuario(id: string) {
    const usuario = await this.usuarioRepository.findOne({ where: { id } });

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    await this.usuarioRepository.update(id, { activo: false });

    return { message: 'Usuario desactivado exitosamente' };
  }

  async deleteUsuario(id: string) {
    const usuario = await this.usuarioRepository.findOne({ where: { id } });

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    await this.usuarioRepository.delete(id);

    return { message: 'Usuario eliminado exitosamente' };
  }

  // Métodos para Estudiantes
  async findAllEstudiantes() {
    return this.estudianteRepository.find({
      relations: ['usuario'],
    });
  }

  async findEstudianteById(id: string) {
    const estudiante = await this.estudianteRepository.findOne({
      where: { id },
      relations: ['usuario'],
    });

    if (!estudiante) {
      throw new NotFoundException('Estudiante no encontrado');
    }

    return estudiante;
  }

  async createEstudiante(createEstudianteDto: CreateEstudianteDto) {
    // Verificar si el código ya existe
    const codigoExistente = await this.estudianteRepository.findOne({
      where: { codigo_estudiante: createEstudianteDto.codigo_estudiante },
    });

    if (codigoExistente) {
      throw new ConflictException('El código de estudiante ya está registrado');
    }

    const estudiante = this.estudianteRepository.create({
      id: uuidv4(),
      ...createEstudianteDto,
    });

    return this.estudianteRepository.save(estudiante);
  }

  async updateEstudiante(id: string, updateEstudianteDto: UpdateEstudianteDto) {
    const estudiante = await this.estudianteRepository.findOne({ where: { id } });

    if (!estudiante) {
      throw new NotFoundException('Estudiante no encontrado');
    }

    await this.estudianteRepository.update(id, updateEstudianteDto);

    return this.estudianteRepository.findOne({ where: { id } });
  }

  // Métodos para Asesores
  async findAllAsesores() {
    return this.asesorRepository.find({
      relations: ['usuario'],
    });
  }

  async findAsesorById(id: string) {
    const asesor = await this.asesorRepository.findOne({
      where: { id },
      relations: ['usuario'],
    });

    if (!asesor) {
      throw new NotFoundException('Asesor no encontrado');
    }

    return asesor;
  }

  async createAsesor(createAsesorDto: CreateAsesorDto) {
    const codigoExistente = await this.asesorRepository.findOne({
      where: { codigo_docente: createAsesorDto.codigo_docente },
    });

    if (codigoExistente) {
      throw new ConflictException('El código de docente ya está registrado');
    }

    const asesor = this.asesorRepository.create({
      id: uuidv4(),
      ...createAsesorDto,
    });

    return this.asesorRepository.save(asesor);
  }

  async updateAsesor(id: string, updateAsesorDto: UpdateAsesorDto) {
    const asesor = await this.asesorRepository.findOne({ where: { id } });

    if (!asesor) {
      throw new NotFoundException('Asesor no encontrado');
    }

    await this.asesorRepository.update(id, updateAsesorDto);

    return this.asesorRepository.findOne({ where: { id } });
  }

  // Métodos para Jurados
  async findAllJurados() {
    return this.juradoRepository.find({
      relations: ['usuario'],
    });
  }

  async findJuradoById(id: string) {
    const jurado = await this.juradoRepository.findOne({
      where: { id },
      relations: ['usuario'],
    });

    if (!jurado) {
      throw new NotFoundException('Jurado no encontrado');
    }

    return jurado;
  }

  async createJurado(createJuradoDto: CreateJuradoDto) {
    const codigoExistente = await this.juradoRepository.findOne({
      where: { codigo_docente: createJuradoDto.codigo_docente },
    });

    if (codigoExistente) {
      throw new ConflictException('El código de docente ya está registrado');
    }

    const jurado = this.juradoRepository.create({
      id: uuidv4(),
      ...createJuradoDto,
    });

    return this.juradoRepository.save(jurado);
  }

  async updateJurado(id: string, updateJuradoDto: UpdateJuradoDto) {
    const jurado = await this.juradoRepository.findOne({ where: { id } });

    if (!jurado) {
      throw new NotFoundException('Jurado no encontrado');
    }

    await this.juradoRepository.update(id, updateJuradoDto);

    return this.juradoRepository.findOne({ where: { id } });
  }

  private sanitizeUsuario(usuario: Usuario) {
    const { contrasena_hash, ...sanitized } = usuario;
    return sanitized;
  }
}
