# Definition of Done (DoD)
## Sistema de Gestión de Tesis UNT

Este documento define los criterios de aceptación que deben cumplirse para considerar una historia de usuario, sprint o fase como **completada**. El DoD es aplicable a todas las fases del desarrollo incremental.

---

## Criterios Generales de Calidad

### 1. Código Funcional y Probado
- ✅ El código implementa completamente la funcionalidad requerida
- ✅ No hay bugs conocidos o errores en consola
- ✅ El código compila sin errores ni warnings
- ✅ La funcionalidad ha sido probada manualmente en los escenarios principales
- ✅ Edge cases han sido considerados y manejados

### 2. Tests Unitarios
- ✅ Cobertura mínima de código: **70%**
- ✅ Todos los servicios tienen tests unitarios
- ✅ Todos los componentes críticos tienen tests unitarios
- ✅ Tests pasan exitosamente en CI/CD
- ✅ Tests son deterministas (no flaky tests)

### 3. Documentación de API
- ✅ Todos los endpoints están documentados en Swagger/OpenAPI
- ✅ Esquemas de request/response están definidos
- ✅ Códigos de error están documentados
- ✅ Ejemplos de uso están incluidos
- ✅ La documentación está actualizada con los últimos cambios

### 4. Revisión de Código
- ✅ El código ha pasado revisión por al menos un peer
- ✅ Comentarios de code review han sido addressed
- ✅ El código sigue los estándares de estilo del proyecto
- ✅ No hay código duplicado significativo
- ✅ Nombres de variables y funciones son descriptivos

### 5. Calidad de Código (Linting)
- ✅ No hay errores de linting
- ✅ No hay warnings de linting (o están justificados)
- ✅ El código sigue las reglas de ESLint/Prettier configuradas
- ✅ Formato de código es consistente

---

## Criterios Específicos por Capa

### Backend (NestJS)
- ✅ DTOs con validación class-validator implementados
- ✅ Guards y decoradores de autorización aplicados
- ✅ Manejo de excepciones centralizado
- ✅ Logging implementado en puntos clave
- ✅ Variables de entorno configuradas
- ✅ Migraciones de base de datos ejecutadas
- ✅ Seed data actualizado si es necesario

### Frontend Web (Next.js)
- ✅ Componentes son reutilizables y modulares
- ✅ Estados de carga y error manejados
- ✅ Responsive design implementado
- ✅ Accesibilidad (WCAG 2.1 AA) considerada
- ✅ Optimización de imágenes implementada
- ✅ SEO tags configurados si aplica
- ✅ Contexto de autenticación implementado

### Mobile (React Native)
- ✅ Navegación condicional por autenticación
- ✅ Almacenamiento seguro de tokens (Keychain/Keystore)
- ✅ Manejo de estados de conexión offline
- ✅ Notificaciones push configuradas
- ✅ Deep links implementados si aplica
- ✅ Performance optimizada (FlatList, memoization)

---

## Criterios Específicos por Fase

### Fase 1: Autenticación y Usuarios
- ✅ Login con JWT funciona correctamente
- ✅ Refresh token mechanism implementado
- ✅ Registro de usuarios con validación de correo institucional
- ✅ Recuperación de contraseña con email
- ✅ RBAC (Role-Based Access Control) funcional
- ✅ Guards por rol en todas las rutas protegidas
- ✅ Perfil de usuario editable

### Fase 2: Proyectos de Tesis
- ✅ Workflow de estados implementado
- ✅ Matching de asesores por área funciona
- ✅ Validación de reglas de negocio (max cambios asesor, min asesorías)
- ✅ Generación de PDF de carta de conformidad
- ✅ Notificaciones de eventos clave
- ✅ Dashboard de seguimiento funcional

### Fase 3: Informes de Tesis
- ✅ Sistema de versionado de documentos funcional
- ✅ Comparación de versiones (diff) implementada
- ✅ Integración con storage (MinIO/S3)
- ✅ Endpoint preparado para verificación de plagio
- ✅ Control de revisiones por asesor
- ✅ Historial de cambios completo

### Fase 4: Titulación
- ✅ Asignación de jurado con validación de doctores
- ✅ Generación de resoluciones y actas
- ✅ Rúbrica de evaluación digital funcional
- ✅ Validación de requisitos para colación
- ✅ Sistema de firmas digitales (mock o real)
- ✅ Workflow de sustentación completo

### Fase 5: Analíticas y Reportes
- ✅ KPIs calculados correctamente
- ✅ Jobs programados funcionando
- ✅ Exportación a PDF/Excel/CSV
- ✅ Caché de consultas frecuentes
- ✅ Dashboard con gráficos interactivos
- ✅ Filtros dinámicos funcionales

### Fase 6: Módulos Complementarios
- ✅ Mínimo 4 complementarios implementados
- ✅ Integraciones externas documentadas
- ✅ Código funcional y probado
- ✅ Arquitectura actualizada si aplica

---

## Criterios de Seguridad

- ✅ No hay credenciales hardcodeadas
- ✅ Variables sensibles en .env
- ✅ Validación de inputs en backend y frontend
- ✅ Sanitización de datos para prevenir XSS
- ✅ SQL injection prevenido con ORM/queries parametrizadas
- ✅ CORS configurado correctamente
- ✅ Rate limiting implementado
- ✅ Headers de seguridad configurados (Helmet, CSP)

---

## Criterios de Performance

- ✅ Tiempo de respuesta de API < 200ms (p95)
- ✅ Time to Interactive (TTI) < 3s (web)
- ✅ First Contentful Paint (FCP) < 1.5s (web)
- ✅ Bundle size optimizado (code splitting)
- ✅ Imágenes optimizadas y lazy loaded
- ✅ Queries de base de datos optimizadas con índices
- ✅ Caché implementado donde apropiado

---

## Criterios de Accesibilidad

- ✅ Contraste de colores cumple WCAG AA
- ✅ Navegación por teclado funcional
- ✅ Screen readers compatibles (ARIA labels)
- ✅ Texto alternativo en imágenes
- ✅ Formularios tienen labels y errores claros
- ✅ Focus indicators visibles

---

## Checklist de Verificación por Historia de Usuario

Antes de marcar una HU como completada:

- [ ] La HU cumple con el criterio de aceptación definido
- [ ] Todos los DoD generales están cumplidos
- [ ] Todos los DoD específicos de capa están cumplidos
- [ ] Tests unitarios pasan con cobertura ≥ 70%
- [ ] Tests de integración pasan
- [ ] Revisión de código completada
- [ ] Linting sin errores
- [� Documentación de API actualizada
- [ ] Manualmente probado en escenarios happy path
- [ ] Manualmente probado en escenarios edge cases
- [ ] Performance dentro de límites aceptables
- [ ] Seguridad revisada
- [ ] Accesibilidad verificada

---

## Excepciones y Waivers

En casos excepcionales, un waiver puede ser otorgado si:

- La funcionalidad es crítica para el negocio y no puede esperar
- El riesgo asociado es bajo y mitigable
- Hay un plan de remediación definido con fecha
- El waiver es aprobado por el Tech Lead y Product Owner

El waiver debe documentarse en el ticket con:
- Razón de la excepción
- Riesgos identificados
- Plan de remediación
- Fecha de resolución

---

## Métricas de Calidad

El equipo monitorea las siguientes métricas:

- **Cobertura de tests**: ≥ 70%
- **Tiempo de revisión de código**: < 24 horas
- **Tiempo de ciclo de HU**: < 5 días
- **Bugs encontrados en producción**: < 5 por sprint
- **Deuda técnica**: Monitoreada y planificada
- **Performance API**: p95 < 200ms
- **Uptime**: 99.9%

---

## Actualización del DoD

Este documento es revisado y actualizado:

- Al final de cada sprint durante retrospective
- Cuando se identifican nuevos requisitos de calidad
- Cuando cambian estándares de la industria
- Cuando el equipo lo considere necesario

Los cambios requieren consenso del equipo técnico.
