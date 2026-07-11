-- ============================================================================
-- Script de Seed Data Inicial
-- Sistema de Gestión de Tesis UNT
-- ============================================================================
-- Descripción: Datos iniciales de roles, estados de flujo y tipos de documento
-- ============================================================================

-- ============================================================================
-- SEED DATA: ROLES
-- ============================================================================

INSERT INTO roles (nombre, descripcion, permisos) VALUES
('administrador', 'Administrador del sistema con acceso total', '{
    "usuarios": ["crear", "leer", "actualizar", "eliminar"],
    "proyectos": ["crear", "leer", "actualizar", "eliminar"],
    "informes": ["crear", "leer", "actualizar", "eliminar"],
    "sustentaciones": ["crear", "leer", "actualizar", "eliminar"],
    "configuracion": ["crear", "leer", "actualizar", "eliminar"],
    "reportes": ["leer", "exportar"]
}'),
('decano', 'Decano de facultad con acceso a reportes y aprobaciones', '{
    "usuarios": ["leer"],
    "proyectos": ["leer", "aprobar"],
    "informes": ["leer", "aprobar"],
    "sustentaciones": ["leer", "aprobar"],
    "reportes": ["leer", "exportar"]
}'),
('coordinador', 'Coordinador de programa de posgrado', '{
    "usuarios": ["leer"],
    "proyectos": ["crear", "leer", "actualizar"],
    "informes": ["leer", "actualizar"],
    "sustentaciones": ["crear", "leer", "actualizar"],
    "jurados": ["asignar"],
    "reportes": ["leer", "exportar"]
}'),
('asesor', 'Docente asesor de tesis', '{
    "proyectos": ["leer", "actualizar"],
    "asesorias": ["crear", "leer", "actualizar"],
    "informes": ["leer", "actualizar", "revisar"],
    "evaluaciones": ["crear"]
}'),
('jurado', 'Jurado de sustentación', '{
    "sustentaciones": ["leer"],
    "evaluaciones": ["crear", "actualizar"]
}'),
('estudiante', 'Estudiante de posgrado', '{
    "proyectos": ["crear", "leer", "actualizar"],
    "asesorias": ["leer", "crear"],
    "informes": ["crear", "leer", "actualizar"],
    "sustentaciones": ["leer", "solicitar"]
}');

-- ============================================================================
-- SEED DATA: CONFIGURACIÓN DE REGLAMENTO
-- ============================================================================

INSERT INTO configuracion_reglamento (clave, valor, descripcion, tipo) VALUES
('max_cambios_asesor', '3', 'Número máximo de cambios de asesor permitidos por proyecto', 'numero'),
('min_asesorias_conformidad', '6', 'Número mínimo de asesorías requeridas para conformidad del asesor', 'numero'),
('max_revisiones_asesor', '3', 'Número máximo de revisiones por asesor antes de conformidad', 'numero'),
('max_porcentaje_plagio', '15', 'Porcentaje máximo de similitud permitido para sustentación', 'numero'),
('nota_minima_aprobacion', '13', 'Nota mínima para aprobar sustentación', 'numero'),
('min_doctores_jurado', '2', 'Número mínimo de doctores requeridos en el jurado', 'numero'),
('plazo_max_proyecto', '12', 'Plazo máximo en meses para completar proyecto de tesis', 'numero'),
('plazo_max_informe', '6', 'Plazo máximo en meses para completar informe de tesis', 'numero'),
('tamano_max_documento', '10485760', 'Tamaño máximo de documentos en bytes (10MB)', 'numero'),
('formatos_permitidos', '["pdf","docx","doc"]', 'Formatos de archivo permitidos', 'json'),
('habilitar_notificaciones_email', 'true', 'Habilitar envío de notificaciones por email', 'booleano'),
('habilitar_notificaciones_push', 'true', 'Habilitar envío de notificaciones push', 'booleano');

-- ============================================================================
-- SEED DATA: ESTADOS DE FLUJO - PROYECTOS DE TESIS
-- ============================================================================

INSERT INTO estados_flujo (entidad, estado, estado_siguiente, descripcion, orden) VALUES
('proyecto_tesis', 'borrador', 'en_revision', 'Proyecto en borrador, no enviado a revisión', 1),
('proyecto_tesis', 'en_revision', 'observado', 'Proyecto enviado a revisión del asesor', 2),
('proyecto_tesis', 'en_revision', 'aprobado', 'Proyecto enviado a revisión del asesor', 2),
('proyecto_tesis', 'observado', 'en_revision', 'Proyecto con observaciones del asesor', 3),
('proyecto_tesis', 'aprobado', 'conformidad_asesor', 'Proyecto aprobado por el asesor', 4),
('proyecto_tesis', 'conformidad_asesor', NULL, 'Proyecto con conformidad del asesor, listo para informe', 5),
('proyecto_tesis', 'rechazado', NULL, 'Proyecto rechazado definitivamente', 6);

-- ============================================================================
-- SEED DATA: ESTADOS DE FLUJO - INFORMES DE TESIS
-- ============================================================================

INSERT INTO estados_flujo (entidad, estado, estado_siguiente, descripcion, orden) VALUES
('informe_tesis', 'borrador', 'en_revision', 'Informe en borrador, no enviado a revisión', 1),
('informe_tesis', 'en_revision', 'observado', 'Informe enviado a revisión del asesor', 2),
('informe_tesis', 'en_revision', 'aprobado', 'Informe enviado a revisión del asesor', 2),
('informe_tesis', 'observado', 'en_revision', 'Informe con observaciones del asesor', 3),
('informe_tesis', 'aprobado', 'conformidad_asesor', 'Informe aprobado por el asesor', 4),
('informe_tesis', 'conformidad_asesor', NULL, 'Informe con conformidad del asesor, listo para sustentación', 5),
('informe_tesis', 'rechazado', NULL, 'Informe rechazado definitivamente', 6);

-- ============================================================================
-- SEED DATA: ESTADOS DE FLUJO - SUSTENTACIONES
-- ============================================================================

INSERT INTO estados_flujo (entidad, estado, estado_siguiente, descripcion, orden) VALUES
('sustentacion', 'solicitada', 'jurado_asignado', 'Sustentación solicitada por el estudiante', 1),
('sustentacion', 'jurado_asignado', 'fecha_programada', 'Jurado asignado por el coordinador', 2),
('sustentacion', 'fecha_programada', 'sustentada', 'Fecha y lugar programados para sustentación', 3),
('sustentacion', 'sustentada', 'aprobada', 'Sustentación realizada, pendiente de calificación', 4),
('sustentacion', 'sustentada', 'rechazada', 'Sustentación realizada, pendiente de calificación', 4),
('sustentacion', 'sustentada', 'aplazada', 'Sustentación realizada, pendiente de calificación', 4),
('sustentacion', 'aprobada', NULL, 'Sustentación aprobada', 5),
('sustentacion', 'rechazada', NULL, 'Sustentación rechazada', 5),
('sustentacion', 'aplazada', 'fecha_programada', 'Sustentación aplazada, requiere nueva programación', 6);

-- ============================================================================
-- SEED DATA: TIPOS DE DOCUMENTO
-- ============================================================================

INSERT INTO tipos_documento (codigo, nombre, descripcion, obligatorio, formato, tamano_maximo) VALUES
('PROYECTO_TESIS', 'Proyecto de Tesis', 'Documento del proyecto de investigación de tesis', true, 'pdf', 10485760),
('INFORME_TESIS', 'Informe de Tesis', 'Informe final de tesis', true, 'pdf', 15728640),
('CARTA_CONFORMIDAD', 'Carta de Conformidad del Asesor', 'Carta de conformidad del asesor del proyecto', true, 'pdf', 5242880),
('CONSTANCIA_PLAGIO', 'Constancia de Originalidad', 'Constancia de verificación de plagio/similitud', true, 'pdf', 5242880),
('RESOLUCION_JURADO', 'Resolución de Nombramiento de Jurado', 'Resolución que nombra el jurado de sustentación', true, 'pdf', 5242880),
('ACTA_SUSTENTACION', 'Acta de Sustentación', 'Acta oficial de la sustentación de tesis', true, 'pdf', 5242880),
('ANEXOS', 'Anexos y Apéndices', 'Documentos adicionales de apoyo', false, 'pdf', 20971520),
('FORMATO_ASESORIA', 'Formato de Asesoría', 'Formato oficial de registro de asesoría', true, 'pdf', 2097152),
('RUBRICA_EVALUACION', 'Rúbrica de Evaluación', 'Rúbrica de evaluación del jurado', true, 'pdf', 2097152),
('DECLARACION_JURADA', 'Declaración Jurada de Autoría', 'Declaración jurada de autoría del trabajo', true, 'pdf', 2097152);

-- ============================================================================
-- SEED DATA: USUARIO ADMINISTRADOR POR DEFECTO
-- ============================================================================

-- Nota: La contraseña debe ser hasheada con bcrypt antes de insertar
-- Este es un placeholder que debe ser actualizado con el hash real
INSERT INTO usuarios (id, rol_id, correo_institucional, contrasena_hash, nombres, apellido_paterno, apellido_materno, dni, telefono, activo) VALUES
('00000000-0000-0000-0000-000000000001', 
 (SELECT id FROM roles WHERE nombre = 'administrador'),
 'admin@unt.edu.pe',
 '$2b$10$placeholder_hash_replace_with_real_bcrypt_hash',
 'Administrador',
 'Sistema',
 'UNT',
 '00000000',
 '+51900000000',
 true);

-- ============================================================================
-- COMENTARIOS DE SEED DATA
-- ============================================================================

COMMENT ON TABLE roles IS 'Seed data: Roles del sistema con permisos';
COMMENT ON TABLE configuracion_reglamento IS 'Seed data: Parámetros configurables del reglamento';
COMMENT ON TABLE estados_flujo IS 'Seed data: Definición de workflows de estados';
COMMENT ON TABLE tipos_documento IS 'Seed data: Catálogo de tipos de documentos';
