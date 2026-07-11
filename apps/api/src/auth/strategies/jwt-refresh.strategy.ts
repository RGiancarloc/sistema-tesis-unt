import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefreshToken } from '../entities/refresh-token.entity';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    private configService: ConfigService,
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_REFRESH_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(req: any, payload: any) {
    const refreshToken = req.headers.authorization?.replace('Bearer ', '');

    const tokenEntity = await this.refreshTokenRepository.findOne({
      where: { token: refreshToken },
      relations: ['usuario'],
    });

    if (!tokenEntity || tokenEntity.revocado || tokenEntity.expira_en < new Date()) {
      throw new UnauthorizedException('Token de refresh inválido o expirado');
    }

    if (!tokenEntity.usuario || !tokenEntity.usuario.activo) {
      throw new UnauthorizedException('Usuario no encontrado o desactivado');
    }

    return {
      sub: tokenEntity.usuario_id,
      correo: tokenEntity.usuario.correo_institucional,
    };
  }
}
