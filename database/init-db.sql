-- Script de inicialización de base de datos para Sistema de Gestión de Tesis UNT
-- Ejecutar este script en PostgreSQL como usuario postgres

-- Crear base de datos
CREATE DATABASE sistema_tesis_unt;

-- Conectar a la base de datos creada
\c sistema_tesis_unt;

-- Crear extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Crear tabla de roles
CREATE TABLE IF NOT EXISTS roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(50) UNIQUE NOT NULL,
    descripcion TEXT,
    permisos JSONB DEFAULT '{}'::jsonb,
    activo BOOLEAN DEFAULT true,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rol_id UUID REFERENCES roles(id),
    correo_institucional VARCHAR(255) UNIQUE NOT NULL,
    contrasena_hash VARCHAR(255) NOT NULL,
    nombres VARCHAR(100) NOT NULL,
    apellido_paterno VARCHAR(100) NOT NULL,
    apellido_materno VARCHAR(100),
    dni VARCHAR(8) UNIQUE,
    telefono VARCHAR(20),
    activo BOOLEAN DEFAULT true,
    verificado BOOLEAN DEFAULT false,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de estudiantes
CREATE TABLE IF NOT EXISTS estudiantes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID REFERENCES usuarios(id) UNIQUE NOT NULL,
    codigo_estudiante VARCHAR(20) UNIQUE NOT NULL,
    programa_estudios VARCHAR(100) NOT NULL,
    facultad VARCHAR(100) NOT NULL,
    fecha_ingreso DATE,
    fecha_egreso_estimada DATE,
    orcid_id VARCHAR(50),
    datos_academicos JSONB DEFAULT '{}'::jsonb,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de asesores
CREATE TABLE IF NOT EXISTS asesores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID REFERENCES usuarios(id) UNIQUE NOT NULL,
    codigo_docente VARCHAR(20) UNIQUE NOT NULL,
    categoria VARCHAR(50),
    departamento VARCHAR(100),
    area_investigacion VARCHAR(100),
    carga_academica_actual INTEGER DEFAULT 0,
    tesis_dirigidas INTEGER DEFAULT 0,
    orcid_id VARCHAR(50),
    datos_investigacion JSONB DEFAULT '{}'::jsonb,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de jurados
CREATE TABLE IF NOT EXISTS jurados (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID REFERENCES usuarios(id) UNIQUE NOT NULL,
    codigo_docente VARCHAR(20) UNIQUE NOT NULL,
    especialidad VARCHAR(100),
    es_doctor BOOLEAN DEFAULT false,
    sustentaciones_participadas INTEGER DEFAULT 0,
    datos_jurado JSONB DEFAULT '{}'::jsonb,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar roles por defecto
INSERT INTO roles (nombre, descripcion, permisos) VALUES
    ('ADMINISTRADOR', 'Administrador del sistema con acceso total', '{"all": true}'),
    ('DECANO', 'Decano de facultad con permisos de aprobación', '{"view_reports": true, "approve_processes": true}'),
    ('COORDINADOR', 'Coordinador de tesis con permisos de gestión', '{"manage_projects": true, "assign_jurados": true, "generate_resolutions": true}'),
    ('ASESOR', 'Asesor de tesis con permisos de revisión', '{"review_projects": true, "register_advisories": true, "approve_reports": true}'),
    ('JURADO', 'Jurado de sustentaciones con permisos de evaluación', '{"evaluate_sustentations": true, "grade_with_rubric": true}'),
    ('ESTUDIANTE', 'Estudiante con permisos básicos', '{"register_projects": true, "register_advisories": true, "upload_reports": true}')
ON CONFLICT (nombre) DO NOTHING;

-- Crear índices para optimización
CREATE INDEX IF NOT EXISTS idx_usuarios_correo ON usuarios(correo_institucional);
CREATE INDEX IF NOT EXISTS idx_usuarios_rol ON usuarios(rol_id);
CREATE INDEX IF NOT EXISTS idx_estudiantes_codigo ON estudiantes(codigo_estudiante);
CREATE INDEX IF NOT EXISTS idx_asesores_codigo ON asesores(codigo_docente);
CREATE INDEX IF NOT EXISTS idx_jurados_codigo ON jurados(codigo_docente);

-- Crear función para actualizar timestamp
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.actualizado_en = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear triggers para actualizar timestamps
CREATE TRIGGER trigger_update_usuarios
    BEFORE UPDATE ON usuarios
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER trigger_update_estudiantes
    BEFORE UPDATE ON estudiantes
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER trigger_update_asesores
    BEFORE UPDATE ON asesores
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER trigger_update_jurados
    BEFORE UPDATE ON jurados
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER trigger_update_roles
    BEFORE UPDATE ON roles
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

-- Comentarios de las tablas
COMMENT ON TABLE roles IS 'Tabla de roles del sistema';
COMMENT ON TABLE usuarios IS 'Tabla de usuarios del sistema';
COMMENT ON TABLE estudiantes IS 'Tabla de estudiantes';
COMMENT ON TABLE asesores IS 'Tabla de asesores/docentes';
COMMENT ON TABLE jurados IS 'Tabla de jurados de sustentaciones';

-- Crear tabla de proyectos de tesis
CREATE TABLE IF NOT EXISTS proyectos_tesis (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    estudiante_id UUID REFERENCES estudiantes(id),
    asesor_id UUID REFERENCES asesores(id),
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT,
    problema_investigacion TEXT,
    objetivos TEXT,
    justificacion TEXT,
    metodologia TEXT,
    palabras_clave TEXT[],
    estado VARCHAR(50) DEFAULT 'BORRADOR',
    fecha_envio_asesor DATE,
    fecha_aprobacion_asesor DATE,
    comentario_asesor TEXT,
    fecha_envio_coordinador DATE,
    fecha_aprobacion_coordinador DATE,
    comentario_coordinador TEXT,
    fecha_inicio DATE,
    fecha_fin_estimada DATE,
    fecha_fin_real DATE,
    metadatos JSONB DEFAULT '{}'::jsonb,
    activo BOOLEAN DEFAULT true,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de asesorías
CREATE TABLE IF NOT EXISTS asesorias (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    proyecto_id UUID REFERENCES proyectos_tesis(id),
    asesor_id UUID REFERENCES asesores(id),
    tipo VARCHAR(50) NOT NULL,
    fecha_programada TIMESTAMP NOT NULL,
    fecha_realizada TIMESTAMP,
    estado VARCHAR(50) DEFAULT 'PROGRAMADA',
    descripcion TEXT,
    observaciones TEXT,
    conclusiones TEXT,
    duracion_minutos INTEGER,
    activo BOOLEAN DEFAULT true,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de hitos del proyecto
CREATE TABLE IF NOT EXISTS hitos_proyecto (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    proyecto_id UUID REFERENCES proyectos_tesis(id),
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    estado VARCHAR(50) DEFAULT 'PENDIENTE',
    fecha_limite DATE,
    fecha_completado DATE,
    orden INTEGER DEFAULT 0,
    observaciones TEXT,
    activo BOOLEAN DEFAULT true,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de informes de tesis
CREATE TABLE IF NOT EXISTS informes_tesis (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    proyecto_id UUID REFERENCES proyectos_tesis(id),
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT,
    estado VARCHAR(50) DEFAULT 'BORRADOR',
    numero_version INTEGER DEFAULT 0,
    fecha_inicio DATE,
    fecha_limite DATE,
    fecha_entrega DATE,
    fecha_aprobacion DATE,
    comentario_asesor TEXT,
    comentario_coordinador TEXT,
    metadatos JSONB DEFAULT '{}'::jsonb,
    activo BOOLEAN DEFAULT true,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de versiones de informe
CREATE TABLE IF NOT EXISTS versiones_informe (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    informe_id UUID REFERENCES informes_tesis(id),
    numero_version INTEGER NOT NULL,
    nombre_archivo VARCHAR(255) NOT NULL,
    ruta_archivo VARCHAR(500) NOT NULL,
    url_archivo VARCHAR(500) NOT NULL,
    tamano_bytes BIGINT NOT NULL,
    tipo_archivo VARCHAR(10) NOT NULL,
    hash_archivo TEXT,
    notas_version TEXT,
    activo BOOLEAN DEFAULT true,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de revisiones de informe
CREATE TABLE IF NOT EXISTS revisiones_informe (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    informe_id UUID REFERENCES informes_tesis(id),
    revisor_id UUID REFERENCES asesores(id),
    version_informe_id UUID REFERENCES versiones_informe(id),
    estado VARCHAR(50) DEFAULT 'PENDIENTE',
    comentarios TEXT,
    observaciones TEXT,
    correcciones JSONB DEFAULT '{}'::jsonb,
    conformidad BOOLEAN DEFAULT false,
    fecha_inicio TIMESTAMP,
    fecha_completado TIMESTAMP,
    notas TEXT,
    activo BOOLEAN DEFAULT true,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear índices adicionales
CREATE INDEX IF NOT EXISTS idx_proyectos_estudiante ON proyectos_tesis(estudiante_id);
CREATE INDEX IF NOT EXISTS idx_proyectos_asesor ON proyectos_tesis(asesor_id);
CREATE INDEX IF NOT EXISTS idx_asesorias_proyecto ON asesorias(proyecto_id);
CREATE INDEX IF NOT EXISTS idx_asesorias_asesor ON asesorias(asesor_id);
CREATE INDEX IF NOT EXISTS idx_hitos_proyecto ON hitos_proyecto(proyecto_id);
CREATE INDEX IF NOT EXISTS idx_informes_proyecto ON informes_tesis(proyecto_id);
CREATE INDEX IF NOT EXISTS idx_versiones_informe ON versiones_informe(informe_id);
CREATE INDEX IF NOT EXISTS idx_revisiones_informe ON revisiones_informe(informe_id);
CREATE INDEX IF NOT EXISTS idx_revisiones_revisor ON revisiones_informe(revisor_id);

-- Crear triggers adicionales
CREATE TRIGGER trigger_update_proyectos_tesis
    BEFORE UPDATE ON proyectos_tesis
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER trigger_update_asesorias
    BEFORE UPDATE ON asesorias
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER trigger_update_hitos_proyecto
    BEFORE UPDATE ON hitos_proyecto
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER trigger_update_informes_tesis
    BEFORE UPDATE ON informes_tesis
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER trigger_update_versiones_informe
    BEFORE UPDATE ON versiones_informe
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER trigger_update_revisiones_informe
    BEFORE UPDATE ON revisiones_informe
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

-- Comentarios adicionales
COMMENT ON TABLE proyectos_tesis IS 'Tabla de proyectos de tesis';
COMMENT ON TABLE asesorias IS 'Tabla de sesiones de asesoría';
COMMENT ON TABLE hitos_proyecto IS 'Tabla de hitos/milestones del proyecto';
COMMENT ON TABLE informes_tesis IS 'Tabla de informes de tesis';
COMMENT ON TABLE versiones_informe IS 'Tabla de versiones de informes';
COMMENT ON TABLE revisiones_informe IS 'Tabla de revisiones de informes';

-- Crear tabla de sustentaciones
CREATE TABLE IF NOT EXISTS sustentaciones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    proyecto_id UUID REFERENCES proyectos_tesis(id),
    titulo VARCHAR(255) NOT NULL,
    estado VARCHAR(50) DEFAULT 'PROGRAMADA',
    modalidad VARCHAR(50) DEFAULT 'PRESENCIAL',
    fecha_programada TIMESTAMP NOT NULL,
    fecha_realizada TIMESTAMP,
    ubicacion VARCHAR(255),
    enlace_virtual VARCHAR(500),
    duracion_minutos INTEGER,
    observaciones TEXT,
    motivo_suspension TEXT,
    acta_url TEXT,
    acta_generada BOOLEAN DEFAULT false,
    metadatos JSONB DEFAULT '{}'::jsonb,
    activo BOOLEAN DEFAULT true,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de jurados de sustentación
CREATE TABLE IF NOT EXISTS jurados_sustentacion (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sustentacion_id UUID REFERENCES sustentaciones(id),
    jurado_id UUID REFERENCES jurados(id),
    rol VARCHAR(50) NOT NULL,
    estado VARCHAR(50) DEFAULT 'ASIGNADO',
    observaciones TEXT,
    fecha_asignacion TIMESTAMP,
    fecha_aceptacion TIMESTAMP,
    activo BOOLEAN DEFAULT true,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de evaluaciones de sustentación
CREATE TABLE IF NOT EXISTS evaluaciones_sustentacion (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sustentacion_id UUID REFERENCES sustentaciones(id),
    jurado_id UUID REFERENCES jurados(id),
    estado VARCHAR(50) DEFAULT 'PENDIENTE',
    calificacion_total DECIMAL(5,2),
    rubrica_evaluacion JSONB DEFAULT '{}'::jsonb,
    comentarios_generales TEXT,
    fortalezas TEXT,
    debilidades TEXT,
    recomendaciones TEXT,
    aprobado BOOLEAN DEFAULT false,
    fecha_evaluacion TIMESTAMP,
    activo BOOLEAN DEFAULT true,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear índices adicionales para sustentaciones
CREATE INDEX IF NOT EXISTS idx_sustentaciones_proyecto ON sustentaciones(proyecto_id);
CREATE INDEX IF NOT EXISTS idx_sustentaciones_fecha ON sustentaciones(fecha_programada);
CREATE INDEX IF NOT EXISTS idx_jurados_sustentacion_sustentacion ON jurados_sustentacion(sustentacion_id);
CREATE INDEX IF NOT EXISTS idx_jurados_sustentacion_jurado ON jurados_sustentacion(jurado_id);
CREATE INDEX IF NOT EXISTS idx_evaluaciones_sustentacion_sustentacion ON evaluaciones_sustentacion(sustentacion_id);
CREATE INDEX IF NOT EXISTS idx_evaluaciones_sustentacion_jurado ON evaluaciones_sustentacion(jurado_id);

-- Crear triggers adicionales para sustentaciones
CREATE TRIGGER trigger_update_sustentaciones
    BEFORE UPDATE ON sustentaciones
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER trigger_update_jurados_sustentacion
    BEFORE UPDATE ON jurados_sustentacion
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER trigger_update_evaluaciones_sustentacion
    BEFORE UPDATE ON evaluaciones_sustentacion
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

-- Comentarios finales
COMMENT ON TABLE sustentaciones IS 'Tabla de sustentaciones de tesis';
COMMENT ON TABLE jurados_sustentacion IS 'Tabla de asignación de jurados a sustentaciones';
COMMENT ON TABLE evaluaciones_sustentacion IS 'Tabla de evaluaciones de sustentaciones';
