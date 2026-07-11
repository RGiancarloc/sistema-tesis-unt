import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuración de CORS
  app.enableCors({
    origin: process.env.WEB_URL || 'http://localhost:3001',
    credentials: true,
  });

  // Prefijo global de API
  app.setGlobalPrefix(process.env.API_PREFIX || 'api/v1');

  // Pipe de validación global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('Sistema de Gestión de Tesis UNT - API')
    .setDescription(
      'API del Sistema de Gestión de Tesis e Informes de Tesis de la Universidad Nacional de Trujillo',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Autenticación', 'Endpoints de autenticación y gestión de sesiones')
    .addTag('Usuarios', 'Gestión de usuarios, estudiantes, asesores y jurados')
    .addTag('Roles', 'Gestión de roles y permisos')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 8000;
  await app.listen(port);

  console.log(`🚀 API ejecutándose en: http://localhost:${port}`);
  console.log(`📚 Documentación Swagger: http://localhost:${port}/api/docs`);
}

bootstrap();
