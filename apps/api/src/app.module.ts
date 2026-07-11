import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { RolesModule } from './roles/roles.module';
import { ProyectosModule } from './proyectos/proyectos.module';
import { InformesModule } from './informes/informes.module';
import { SustentacionesModule } from './sustentaciones/sustentaciones.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DATABASE_HOST', 'localhost'),
        port: configService.get<number>('DATABASE_PORT', 5432),
        username: configService.get<string>('DATABASE_USER', 'postgres'),
        password: configService.get<string>('DATABASE_PASSWORD', 'postgres'),
        database: configService.get<string>('DATABASE_NAME', 'sistema_tesis_unt'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true, // Temporalmente habilitado para crear tablas
        logging: configService.get<string>('NODE_ENV') === 'development',
      }),
      inject: [ConfigService],
    }),
    DatabaseModule,
    AuthModule,
    UsuariosModule,
    RolesModule,
    ProyectosModule,
    InformesModule,
    SustentacionesModule,
  ],
})
export class AppModule {}
