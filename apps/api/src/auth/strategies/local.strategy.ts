import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'correo_institucional',
      passwordField: 'contrasena',
    });
  }

  async validate(
    correo_institucional: string,
    contrasena: string,
  ): Promise<any> {
    const usuario = await this.authService.validateUser(
      correo_institucional,
      contrasena,
    );

    if (!usuario) {
      throw new UnauthorizedException();
    }

    return usuario;
  }
}
