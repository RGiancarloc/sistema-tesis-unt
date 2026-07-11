-- ============================================================================
-- Script de Creación de Tablas - Sistema de Gestión de Tesis UNT
-- Base de Datos: PostgreSQL 15+
-- ============================================================================
-- Autor: Sistema de Gestión de Tesis UNT
-- Fecha: 2026
-- Descripción: Creación de todas las tablas del sistema con constraints e índices
-- ============================================================================

-- Extensión para generar UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- TABLAS DE IDENTIDAD Y ACCESO
-- ============================================================================

-- Tabla: roles
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(50) UNIQUE NOT NULL,
    descripcion VARCHAR(255),
    permisos JSONB DEFAULT '{}',
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: usuarios
CREATE TABLE usuarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rol_id UUID REFERENCES roles(id) ON DELETE SET NULL,
    correo_institucional VARCHAR(255) UNIQUE NOT NULL,
    contrasena_hash VARCHAR(255) NOT NULL,
    nombres VARCHAR(100) NOT NULL,
    apellido_paterno VARCHAR(100) NOT NULL,
    apellido_materno VARCHAR(100),
    dni VARCHAR(8) UNIQUE,
    telefono VARCHAR(20),
    activo BOOLEAN DEFAULT true,
    ultimo_acceso TIMESTAMP WITH TIME ZONE,
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    creado_por UUID REFERENCES usuarios(id),
    actualizado_por UUID REFERENCES usuarios(id),
    CONSTRAINT chk_dni_formato CHECK (dni ~ '^[0-9]{8}$')
);

-- Tabla: estudiantes
CREATE TABLE estudiantes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID UNIQUE NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    codigo_estudiante VARCHAR(20) UNIQUE NOT NULL,
    programa_estudios VARCHAR(150) NOT NULL,
    facultad VARCHAR(150) NOT NULL,
    fecha_ingreso DATE NOT NULL,
    fecha_egreso_estimada DATE,
    orcid_id VARCHAR(19),
    datos_academicos JSONB DEFAULT '{}',
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    creado_por UUID REFERENCES usuarios(id),
    actualizado_por UUID REFERENCES usuarios(id)
);

-- Tabla: asesores
CREATE TABLE asesores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID UNIQUE NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    codigo_docente VARCHAR(20) UNIQUE NOT NULL,
    categoria VARCHAR(50),
    departamento VARCHAR(150),
    area_investigacion VARCHAR(200) NOT NULL,
    carga_academica_actual INTEGER DEFAULT 0,
    tesis_dirigidas INTEGER DEFAULT 0,
    orcid_id VARCHAR(19),
    datos_investigacion JSONB DEFAULT '{}',
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    creado_por UUID REFERENCES usuarios(id),
    actualizado_por UUID REFERENCES usuarios(id),
    CONSTRAINT chk_carga_academica CHECK (carga_academica_actual >= 0),
    CONSTRAINT chk_tesis_dirigidas CHECK (tesis_dirigidas >= 0)
);

-- Tabla: jurados
CREATE TABLE jurados (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID UNIQUE NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    codigo_docente VARCHAR(20) UNIQUE NOT NULL,
    especialidad VARCHAR(200) NOT NULL,
    es_doctor BOOLEAN DEFAULT false,
    sustentaciones_participadas INTEGER DEFAULT 0,
    datos_jurado JSONB DEFAULT '{}',
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    creado_por UUID REFERENCES usuarios(id),
    actualizado_por UUID REFERENCES usuarios(id),
    CONSTRAINT chk_sustentaciones CHECK (sustentaciones_participadas >= 0)
);

-- ============================================================================
-- TABLAS DE GESTIÓN DE PROYECTOS DE TESIS
-- ============================================================================

-- Tabla: proyectos_tesis
CREATE TABLE proyectos_tesis (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    estudiante_id UUID NOT NULL REFERENCES estudiantes(id) ON DELETE CASCADE,
    asesor_id UUID REFERENCES asesores(id) ON DELETE SET NULL,
    titulo VARCHAR(300) NOT NULL,
    resumen TEXT,
    problema_investigacion TEXT,
    objetivos TEXT,
    justificacion TEXT,
    area_investigacion VARCHAR(200) NOT NULL,
    estado VARCHAR(50) DEFAULT 'borrador',
    cambios_asesor INTEGER DEFAULT 0,
    fecha_inscripcion DATE,
    fecha_aprobacion DATE,
    fecha_conformidad_asesor DATE,
    metadatos JSONB DEFAULT '{}',
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    creado_por UUID REFERENCES usuarios(id),
    actualizado_por UUID REFERENCES usuarios(id),
    CONSTRAINT chk_cambios_asesor CHECK (cambios_asesor <= 3),
    CONSTRAINT chk_estado_proyecto CHECK (estado IN ('borrador', 'en_revision', 'observado', 'aprobado', 'conformidad_asesor', 'rechazado'))
);

-- Tabla: asesorias
CREATE TABLE asesorias (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    proyecto_tesis_id UUID NOT NULL REFERENCES proyectos_tesis(id) ON DELETE CASCADE,
    asesor_id UUID NOT NULL REFERENCES asesores(id) ON DELETE CASCADE,
    fecha_asesoria DATE NOT NULL,
    observaciones TEXT,
    recomendaciones TEXT,
    tipo VARCHAR(50) DEFAULT 'presencial',
    duracion_minutos INTEGER DEFAULT 60,
    detalles JSONB DEFAULT '{}',
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    creado_por UUID REFERENCES usuarios(id),
    actualizado_por UUID REFERENCES usuarios(id),
    CONSTRAINT chk_tipo_asesoria CHECK (tipo IN ('presencial', 'virtual', 'telefonica')),
    CONSTRAINT chk_duracion CHECK (duracion_minutos > 0)
);

-- ============================================================================
-- TABLAS DE GESTIÓN DE INFORMES DE TESIS
-- ============================================================================

-- Tabla: informes_tesis
CREATE TABLE informes_tesis (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    proyecto_tesis_id UUID UNIQUE NOT NULL REFERENCES proyectos_tesis(id) ON DELETE CASCADE,
    titulo VARCHAR(300) NOT NULL,
    resumen TEXT,
    estado VARCHAR(50) DEFAULT 'borrador',
    revisiones_asesor INTEGER DEFAULT 0,
    porcentaje_similitud DECIMAL(5,2),
    fecha_inicio DATE,
    fecha_conformidad DATE,
    metadatos JSONB DEFAULT '{}',
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    creado_por UUID REFERENCES usuarios(id),
    actualizado_por UUID REFERENCES usuarios(id),
    CONSTRAINT chk_revisiones_asesor CHECK (revisiones_asesor <= 3),
    CONSTRAINT chk_porcentaje_similitud CHECK (porcentaje_similitud IS NULL OR (porcentaje_similitud >= 0 AND porcentaje_similitud <= 100)),
    CONSTRAINT chk_estado_informe CHECK (estado IN ('borrador', 'en_revision', 'observado', 'aprobado', 'conformidad_asesor', 'rechazado'))
);

-- Tabla: documentos
CREATE TABLE documentos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    informe_tesis_id UUID NOT NULL REFERENCES informes_tesis(id) ON DELETE CASCADE,
    nombre VARCHAR(255) NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    ruta_archivo VARCHAR(500) NOT NULL,
    tamano_bytes BIGINT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    estado VARCHAR(50) DEFAULT 'activo',
    metadatos JSONB DEFAULT '{}',
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    creado_por UUID REFERENCES usuarios(id),
    actualizado_por UUID REFERENCES usuarios(id),
    CONSTRAINT chk_tamano CHECK (tamano_bytes > 0),
    CONSTRAINT chk_estado_documento CHECK (estado IN ('activo', 'eliminado', 'archivado'))
);

-- Tabla: versiones_documento
CREATE TABLE versiones_documento (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    documento_id UUID NOT NULL REFERENCES documentos(id) ON DELETE CASCADE,
    numero_version VARCHAR(20) NOT NULL,
    ruta_archivo VARCHAR(500) NOT NULL,
    tamano_bytes BIGINT NOT NULL,
    comentario TEXT,
    estado VARCHAR(50) DEFAULT 'activo',
    metadatos JSONB DEFAULT '{}',
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    creado_por UUID REFERENCES usuarios(id),
    CONSTRAINT chk_tamano_version CHECK (tamano_bytes > 0),
    CONSTRAINT chk_estado_version CHECK (estado IN ('activo', 'eliminado', 'reemplazado')),
    CONSTRAINT uq_documento_version UNIQUE (documento_id, numero_version)
);

-- Tabla: historial_cambios
CREATE TABLE historial_cambios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    version_documento_id UUID REFERENCES versiones_documento(id) ON DELETE SET NULL,
    usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    tipo_cambio VARCHAR(50) NOT NULL,
    descripcion TEXT,
    valor_anterior JSONB,
    valor_nuevo JSONB,
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_tipo_cambio CHECK (tipo_cambio IN ('creacion', 'actualizacion', 'eliminacion', 'restauracion'))
);

-- ============================================================================
-- TABLAS DE PROCESO DE TITULACIÓN
-- ============================================================================

-- Tabla: sustentaciones
CREATE TABLE sustentaciones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    informe_tesis_id UUID UNIQUE NOT NULL REFERENCES informes_tesis(id) ON DELETE CASCADE,
    estado VARCHAR(50) DEFAULT 'solicitada',
    fecha_programada DATE,
    hora_programada TIME,
    lugar VARCHAR(200),
    numero_resolucion VARCHAR(50),
    fecha_resolucion DATE,
    nota_final DECIMAL(3,2),
    resultado VARCHAR(50),
    metadatos JSONB DEFAULT '{}',
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    creado_por UUID REFERENCES usuarios(id),
    actualizado_por UUID REFERENCES usuarios(id),
    CONSTRAINT chk_nota_final CHECK (nota_final IS NULL OR (nota_final >= 0 AND nota_final <= 20)),
    CONSTRAINT chk_estado_sustentacion CHECK (estado IN ('solicitada', 'jurado_asignado', 'fecha_programada', 'sustentada', 'aprobada', 'rechazada', 'aplazada')),
    CONSTRAINT chk_resultado CHECK (resultado IS NULL OR resultado IN ('aprobado', 'rechazado', 'aplazado'))
);

-- Tabla: jurados_sustentacion
CREATE TABLE jurados_sustentacion (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sustentacion_id UUID NOT NULL REFERENCES sustentaciones(id) ON DELETE CASCADE,
    jurado_id UUID NOT NULL REFERENCES jurados(id) ON DELETE CASCADE,
    rol VARCHAR(50) NOT NULL,
    asistio BOOLEAN DEFAULT false,
    observaciones TEXT,
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_rol_jurado CHECK (rol IN ('presidente', 'miembro', 'suplente')),
    CONSTRAINT uq_sustentacion_jurado UNIQUE (sustentacion_id, jurado_id)
);

-- Tabla: evaluaciones
CREATE TABLE evaluaciones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sustentacion_id UUID NOT NULL REFERENCES sustentaciones(id) ON DELETE CASCADE,
    jurado_id UUID NOT NULL REFERENCES jurados(id) ON DELETE CASCADE,
    criterio_1 DECIMAL(4,2),
    criterio_2 DECIMAL(4,2),
    criterio_3 DECIMAL(4,2),
    criterio_4 DECIMAL(4,2),
    nota_total DECIMAL(4,2),
    comentarios TEXT,
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    creado_por UUID REFERENCES usuarios(id),
    CONSTRAINT chk_criterio CHECK (
        (criterio_1 IS NULL OR (criterio_1 >= 0 AND criterio_1 <= 20)) AND
        (criterio_2 IS NULL OR (criterio_2 >= 0 AND criterio_2 <= 20)) AND
        (criterio_3 IS NULL OR (criterio_3 >= 0 AND criterio_3 <= 20)) AND
        (criterio_4 IS NULL OR (criterio_4 >= 0 AND criterio_4 <= 20))
    ),
    CONSTRAINT chk_nota_total CHECK (nota_total IS NULL OR (nota_total >= 0 AND nota_total <= 20)),
    CONSTRAINT uq_sustentacion_jurado_eval UNIQUE (sustentacion_id, jurado_id)
);

-- ============================================================================
-- TABLAS DE SISTEMA
-- ============================================================================

-- Tabla: notificaciones
CREATE TABLE notificaciones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    tipo VARCHAR(50) NOT NULL,
    titulo VARCHAR(200) NOT NULL,
    mensaje TEXT NOT NULL,
    canal VARCHAR(50) DEFAULT 'in_app',
    leida BOOLEAN DEFAULT false,
    fecha_lectura TIMESTAMP WITH TIME ZONE,
    metadatos JSONB DEFAULT '{}',
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_canal_notificacion CHECK (canal IN ('in_app', 'email', 'push', 'sms')),
    CONSTRAINT chk_tipo_notificacion CHECK (tipo IN ('info', 'alerta', 'exito', 'advertencia', 'error'))
);

-- Tabla: configuracion_reglamento
CREATE TABLE configuracion_reglamento (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clave VARCHAR(100) UNIQUE NOT NULL,
    valor TEXT NOT NULL,
    descripcion TEXT,
    tipo VARCHAR(50) DEFAULT 'texto',
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_tipo_configuracion CHECK (tipo IN ('texto', 'numero', 'booleano', 'json'))
);

-- Tabla: estados_flujo
CREATE TABLE estados_flujo (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    configuracion_id UUID REFERENCES configuracion_reglamento(id) ON DELETE CASCADE,
    entidad VARCHAR(50) NOT NULL,
    estado VARCHAR(50) NOT NULL,
    estado_siguiente VARCHAR(50),
    descripcion TEXT,
    orden INTEGER DEFAULT 0,
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_entidad_flujo CHECK (entidad IN ('proyecto_tesis', 'informe_tesis', 'sustentacion'))
);

-- Tabla: tipos_documento
CREATE TABLE tipos_documento (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    configuracion_id UUID REFERENCES configuracion_reglamento(id) ON DELETE CASCADE,
    codigo VARCHAR(50) UNIQUE NOT NULL,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    obligatorio BOOLEAN DEFAULT false,
    formato VARCHAR(50) DEFAULT 'pdf',
    tamano_maximo BIGINT DEFAULT 10485760,
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_formato_documento CHECK (formato IN ('pdf', 'docx', 'doc', 'rtf', 'txt')),
    CONSTRAINT chk_tamano_maximo CHECK (tamano_maximo > 0)
);

-- ============================================================================
-- ÍNDICES
-- ============================================================================

-- Índices para usuarios
CREATE INDEX idx_usuarios_correo ON usuarios(correo_institucional);
CREATE INDEX idx_usuarios_dni ON usuarios(dni);
CREATE INDEX idx_usuarios_activo ON usuarios(activo);
CREATE INDEX idx_usuarios_rol ON usuarios(rol_id);

-- Índices para estudiantes
CREATE INDEX idx_estudiantes_codigo ON estudiantes(codigo_estudiante);
CREATE INDEX idx_estudiantes_programa ON estudiantes(programa_estudios);
CREATE INDEX idx_estudiantes_facultad ON estudiantes(facultad);

-- Índices para asesores
CREATE INDEX idx_asesores_codigo ON asesores(codigo_docente);
CREATE INDEX idx_asesores_area ON asesores(area_investigacion);
CREATE INDEX idx_asesores_carga ON asesores(carga_academica_actual);

-- Índices para proyectos de tesis
CREATE INDEX idx_proyectos_estudiante ON proyectos_tesis(estudiante_id);
CREATE INDEX idx_proyectos_asesor ON proyectos_tesis(asesor_id);
CREATE INDEX idx_proyectos_estado ON proyectos_tesis(estado);
CREATE INDEX idx_proyectos_area ON proyectos_tesis(area_investigacion);
CREATE INDEX idx_proyectos_fecha_inscripcion ON proyectos_tesis(fecha_inscripcion);

-- Índices para asesorías
CREATE INDEX idx_asesorias_proyecto ON asesorias(proyecto_tesis_id);
CREATE INDEX idx_asesorias_asesor ON asesorias(asesor_id);
CREATE INDEX idx_asesorias_fecha ON asesorias(fecha_asesoria);

-- Índices para informes de tesis
CREATE INDEX idx_informes_proyecto ON informes_tesis(proyecto_tesis_id);
CREATE INDEX idx_informes_estado ON informes_tesis(estado);
CREATE INDEX idx_informes_fecha_inicio ON informes_tesis(fecha_inicio);

-- Índices para documentos
CREATE INDEX idx_documentos_informe ON documentos(informe_tesis_id);
CREATE INDEX idx_documentos_tipo ON documentos(tipo);
CREATE INDEX idx_documentos_estado ON documentos(estado);

-- Índices para versiones de documento
CREATE INDEX idx_versiones_documento ON versiones_documento(documento_id);
CREATE INDEX idx_versiones_numero ON versiones_documento(numero_version);

-- Índices para historial de cambios
CREATE INDEX idx_historial_version ON historial_cambios(version_documento_id);
CREATE INDEX idx_historial_usuario ON historial_cambios(usuario_id);
CREATE INDEX idx_historial_tipo ON historial_cambios(tipo_cambio);

-- Índices para sustentaciones
CREATE INDEX idx_sustentaciones_informe ON sustentaciones(informe_tesis_id);
CREATE INDEX idx_sustentaciones_estado ON sustentaciones(estado);
CREATE INDEX idx_sustentaciones_fecha ON sustentaciones(fecha_programada);

-- Índices para jurados de sustentación
CREATE INDEX idx_jurados_sustentacion_sustentacion ON jurados_sustentacion(sustentacion_id);
CREATE INDEX idx_jurados_sustentacion_jurado ON jurados_sustentacion(jurado_id);

-- Índices para evaluaciones
CREATE INDEX idx_evaluaciones_sustentacion ON evaluaciones(sustentacion_id);
CREATE INDEX idx_evaluaciones_jurado ON evaluaciones(jurado_id);

-- Índices para notificaciones
CREATE INDEX idx_notificaciones_usuario ON notificaciones(usuario_id);
CREATE INDEX idx_notificaciones_leida ON notificaciones(leida);
CREATE INDEX idx_notificaciones_tipo ON notificaciones(tipo);
CREATE INDEX idx_notificaciones_creado_en ON notificaciones(creado_en);

-- Índices para configuración
CREATE INDEX idx_estados_flujo_entidad ON estados_flujo(entidad);
CREATE INDEX idx_estados_flujo_estado ON estados_flujo(estado);

-- ============================================================================
-- COMENTARIOS DE TABLAS
-- ============================================================================

COMMENT ON TABLE roles IS 'Catálogo de roles del sistema con permisos asociados';
COMMENT ON TABLE usuarios IS 'Tabla principal de usuarios del sistema';
COMMENT ON TABLE estudiantes IS 'Información específica de estudiantes de posgrado';
COMMENT ON TABLE asesores IS 'Información específica de docentes asesores de tesis';
COMMENT ON TABLE jurados IS 'Información específica de jurados de sustentación';
COMMENT ON TABLE proyectos_tesis IS 'Proyectos de investigación de tesis de estudiantes';
COMMENT ON TABLE asesorias IS 'Registro de sesiones de asesoría entre estudiante y asesor';
COMMENT ON TABLE informes_tesis IS 'Informes finales de tesis vinculados a proyectos aprobados';
COMMENT ON TABLE documentos IS 'Documentos asociados a informes de tesis';
COMMENT ON TABLE versiones_documento IS 'Control de versiones de documentos';
COMMENT ON TABLE historial_cambios IS 'Auditoría de cambios en versiones de documentos';
COMMENT ON TABLE sustentaciones IS 'Programación y ejecución de sustentaciones de tesis';
COMMENT ON TABLE jurados_sustentacion IS 'Asignación de jurados a sustentaciones';
COMMENT ON TABLE evaluaciones IS 'Calificaciones de jurados con rúbrica de evaluación';
COMMENT ON TABLE notificaciones IS 'Sistema de notificaciones a usuarios del sistema';
COMMENT ON TABLE configuracion_reglamento IS 'Parámetros configurables del reglamento de tesis';
COMMENT ON TABLE estados_flujo IS 'Definición de workflows de estados para entidades';
COMMENT ON TABLE tipos_documento IS 'Catálogo de tipos de documentos requeridos en el proceso';
