# API Backend - NestJS

API backend del Sistema de Gestión de Tesis UNT.

## Stack Tecnológico
- NestJS (Node.js framework)
- TypeScript
- PostgreSQL (Prisma ORM)
- Redis (caché y sessions)
- JWT (autenticación)
- Swagger/OpenAPI (documentación)

## Microservicios
- `/src/auth` - Servicio de autenticación
- `/src/usuarios` - Servicio de usuarios
- `/src/proyectos-tesis` - Servicio de proyectos de tesis
- `/src/informes-tesis` - Servicio de informes de tesis
- `/src/titulacion` - Servicio de titulación
- `/src/analiticas` - Servicio de analíticas
- `/src/notificaciones` - Servicio de notificaciones
- `/src/documentos` - Servicio de documentos
- `/src/plagio` - Servicio de verificación de plagio
- `/src/repositorio` - Servicio de repositorio institucional
- `/src/colaboracion` - Servicio de colaboración en tiempo real

## Estructura
- `/src` - Código fuente
- `/src/modules` - Módulos de negocio
- `/src/common` - Utilidades comunes
- `/src/config` - Configuraciones
- `/src/decorators` - Decoradores personalizados
- `/src/guards` - Guards de autorización
- `/src/interceptors` - Interceptors
- `/src/filters` - Filtros de excepciones
- `/test` - Tests
