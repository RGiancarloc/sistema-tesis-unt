# Sistema de Gestión de Tesis e Informes de Tesis - UNT

Sistema integral para la gestión de tesis e informes de tesis de la Universidad Nacional de Trujillo (UNT), alineado con los estándares de las mejores universidades del mundo.

## 🏗️ Arquitectura

Monorepo con aplicaciones web, móvil y API backend:

- **Web**: Next.js 14+ con TypeScript y TailwindCSS
- **Mobile**: React Native con Expo
- **API**: NestJS (Node.js) con microservicios
- **Database**: PostgreSQL + Redis + MinIO

## 📁 Estructura del Proyecto

```
sistema-tesis-unt/
├── apps/
│   ├── web/              # Aplicación web (Next.js)
│   ├── mobile/           # Aplicación móvil (React Native)
│   └── api/              # API Backend (NestJS)
├── packages/
│   ├── shared-types/     # Tipos TypeScript compartidos
│   ├── ui-components/    # Componentes UI compartidos
│   ├── infra/            # Configuraciones de infraestructura
│   ├── docker/           # Configuraciones Docker
│   └── k8s/              # Manifiestos Kubernetes
├── docs/                 # Documentación
├── database/             # Scripts de base de datos
└── README.md
```

## 🚀 Tecnologías

### Frontend Web
- Next.js 14+ (App Router)
- TypeScript
- TailwindCSS
- shadcn/ui
- React Query
- Zustand

### Mobile
- React Native (Expo)
- TypeScript
- React Navigation
- AsyncStorage

### Backend
- NestJS
- TypeScript
- Prisma ORM
- PostgreSQL
- Redis
- JWT
- Swagger/OpenAPI

### Infraestructura
- Docker
- Docker Compose
- Kubernetes
- MinIO (S3-compatible storage)

## 📋 Módulos del Sistema

1. **Autenticación y Usuarios**: Gestión de usuarios, roles y permisos (RBAC)
2. **Proyectos de Tesis**: Inscripción, seguimiento y aprobación de proyectos
3. **Informes de Tesis**: Versionado, revisión y conformidad de informes
4. **Titulación**: Sustentaciones, jurados y actas
5. **Analíticas**: Dashboards, KPIs y reportes
6. **Complementarios**: Repositorio, colaboración, plagio, etc.

## 🔐 Seguridad

- Autenticación JWT con refresh tokens
- Autorización por roles (RBAC)
- Encriptación de contraseñas con bcrypt
- Encriptación de datos sensibles
- Validación de inputs
- Rate limiting
- CORS configurado

## 📊 Base de Datos

- PostgreSQL como base de datos principal
- Redis para caché y sessions
- MinIO para almacenamiento de documentos
- Triggers de auditoría
- Índices optimizados

## 🧪 Testing

- Tests unitarios (Jest)
- Tests de integración
- Cobertura mínima: 70%
- E2E tests (Playwright)

## 📖 Documentación

- [Arquitectura](./docs/arquitectura/)
- [API Documentation](./docs/api/)
- [Guía de Desarrollador](./docs/guia-desarrollador/)
- [Guía de Usuario](./docs/guia-usuario/)

## 🛠️ Desarrollo

### Prerrequisitos
- Node.js 18+
- PostgreSQL 15+
- Redis 7+
- Docker y Docker Compose

### Instalación

```bash
# Clonar el repositorio
git clone <repo-url>
cd sistema-tesis-unt

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env

# Ejecutar migraciones de base de datos
npm run db:migrate

# Ejecutar seed data
npm run db:seed

# Iniciar servicios en desarrollo
npm run dev
```

### Scripts Disponibles

```bash
npm run dev              # Iniciar todos los servicios en desarrollo
npm run build            # Build de todas las aplicaciones
npm run test             # Ejecutar tests
npm run test:coverage    # Ejecutar tests con cobertura
npm run lint             # Ejecutar linter
npm run db:migrate       # Ejecutar migraciones de BD
npm run db:seed          # Ejecutar seed data
npm run docker:up        # Iniciar Docker Compose
npm run docker:down      # Detener Docker Compose
```

## 📝 Metodología

Desarrollo ágil con Scrum por fases incrementales:

- **Fase 0**: Setup inicial y arquitectura base ✅
- **Fase 1**: Módulo core de autenticación y gestión de usuarios
- **Fase 2**: Seguimiento de proyecto de tesis
- **Fase 3**: Seguimiento de elaboración de informe de tesis
- **Fase 4**: Proceso de titulación
- **Fase 5**: Dashboard, analíticas y reportes
- **Fase 6**: Módulos complementarios
- **Fase Final**: Verificación completa y cierre

## 👥 Roles del Sistema

- **Estudiante**: Inscribir proyectos, registrar asesorías, subir informes
- **Asesor**: Revisar proyectos, registrar asesorías, emitir conformidad
- **Jurado**: Evaluar sustentaciones, calificar con rúbrica
- **Coordinador**: Gestionar proyectos, asignar jurados, generar resoluciones
- **Decano**: Aprobar procesos, ver reportes ejecutivos
- **Administrador**: Gestión del sistema, usuarios y configuración

## 📄 Licencia

Copyright © 2026 Universidad Nacional de Trujillo

## 🤝 Contribución

Para contribuir al proyecto, por favor revisar la [Guía de Contribución](./docs/guia-desarrollador/CONTRIBUTING.md).

## 📞 Soporte

Para soporte técnico, contactar al equipo de desarrollo de la UNT.
