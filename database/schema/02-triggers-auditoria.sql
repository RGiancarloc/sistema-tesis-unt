-- ============================================================================
-- Script de Triggers de Auditoría
-- Sistema de Gestión de Tesis UNT
-- ============================================================================
-- Descripción: Triggers para actualización automática de campos de auditoría
-- ============================================================================

-- ============================================================================
-- FUNCIÓN PARA ACTUALIZAR CAMPO actualizado_en
-- ============================================================================

CREATE OR REPLACE FUNCTION actualizar_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.actualizado_en = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- FUNCIÓN PARA REGISTRAR CAMPO actualizado_por
-- ============================================================================

CREATE OR REPLACE FUNCTION actualizar_usuario_actualizacion()
RETURNS TRIGGER AS $$
BEGIN
    -- Si el campo actualizado_por no se proporciona explícitamente, mantener el valor anterior
    IF TG_OP = 'UPDATE' AND NEW.actualizado_por IS NULL AND OLD.actualizado_por IS NOT NULL THEN
        NEW.actualizado_por = OLD.actualizado_por;
    END IF;
    NEW.actualizado_en = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- APLICACIÓN DE TRIGGERS A TABLAS PRINCIPALES
-- ============================================================================

-- Trigger para roles
CREATE TRIGGER trg_roles_actualizar_timestamp
    BEFORE UPDATE ON roles
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_timestamp();

-- Trigger para usuarios
CREATE TRIGGER trg_usuarios_actualizar_usuario
    BEFORE UPDATE ON usuarios
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_usuario_actualizacion();

-- Trigger para estudiantes
CREATE TRIGGER trg_estudiantes_actualizar_usuario
    BEFORE UPDATE ON estudiantes
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_usuario_actualizacion();

-- Trigger para asesores
CREATE TRIGGER trg_asesores_actualizar_usuario
    BEFORE UPDATE ON asesores
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_usuario_actualizacion();

-- Trigger para jurados
CREATE TRIGGER trg_jurados_actualizar_usuario
    BEFORE UPDATE ON jurados
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_usuario_actualizacion();

-- Trigger para proyectos_tesis
CREATE TRIGGER trg_proyectos_tesis_actualizar_usuario
    BEFORE UPDATE ON proyectos_tesis
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_usuario_actualizacion();

-- Trigger para asesorias
CREATE TRIGGER trg_asesorias_actualizar_usuario
    BEFORE UPDATE ON asesorias
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_usuario_actualizacion();

-- Trigger para informes_tesis
CREATE TRIGGER trg_informes_tesis_actualizar_usuario
    BEFORE UPDATE ON informes_tesis
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_usuario_actualizacion();

-- Trigger para documentos
CREATE TRIGGER trg_documentos_actualizar_usuario
    BEFORE UPDATE ON documentos
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_usuario_actualizacion();

-- Trigger para jurados_sustentacion
CREATE TRIGGER trg_jurados_sustentacion_actualizar_usuario
    BEFORE UPDATE ON jurados_sustentacion
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_timestamp();

-- Trigger para sustentaciones
CREATE TRIGGER trg_sustentaciones_actualizar_usuario
    BEFORE UPDATE ON sustentaciones
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_usuario_actualizacion();

-- Trigger para configuracion_reglamento
CREATE TRIGGER trg_configuracion_reglamentar_actualizar_timestamp
    BEFORE UPDATE ON configuracion_reglamento
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_timestamp();

-- ============================================================================
-- FUNCIÓN PARA AUDITORÍA DE CAMBIOS EN PROYECTOS DE TESIS
-- ============================================================================

CREATE OR REPLACE FUNCTION auditar_cambio_proyecto()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO historial_cambios (
            version_documento_id,
            usuario_id,
            tipo_cambio,
            descripcion,
            valor_anterior,
            valor_nuevo
        ) VALUES (
            NULL,
            NEW.creado_por,
            'creacion',
            'Creación de proyecto de tesis: ' || NEW.titulo,
            NULL,
            jsonb_build_object(
                'titulo', NEW.titulo,
                'estado', NEW.estado,
                'estudiante_id', NEW.estudiante_id
            )
        );
    ELSIF TG_OP = 'UPDATE' THEN
        -- Detectar cambios significativos
        IF OLD.estado <> NEW.estado THEN
            INSERT INTO historial_cambios (
                version_documento_id,
                usuario_id,
                tipo_cambio,
                descripcion,
                valor_anterior,
                valor_nuevo
            ) VALUES (
                NULL,
                COALESCE(NEW.actualizado_por, OLD.actualizado_por),
                'actualizacion',
                'Cambio de estado en proyecto de tesis',
                jsonb_build_object('estado', OLD.estado),
                jsonb_build_object('estado', NEW.estado)
            );
        END IF;
        
        IF OLD.asesor_id <> NEW.asesor_id THEN
            INSERT INTO historial_cambios (
                version_documento_id,
                usuario_id,
                tipo_cambio,
                descripcion,
                valor_anterior,
                valor_nuevo
            ) VALUES (
                NULL,
                COALESCE(NEW.actualizado_por, OLD.actualizado_por),
                'actualizacion',
                'Cambio de asesor en proyecto de tesis',
                jsonb_build_object('asesor_id', OLD.asesor_id),
                jsonb_build_object('asesor_id', NEW.asesor_id)
            );
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger de auditoría para proyectos_tesis
CREATE TRIGGER trg_proyectos_tesis_auditar
    AFTER INSERT OR UPDATE ON proyectos_tesis
    FOR EACH ROW
    EXECUTE FUNCTION auditar_cambio_proyecto();

-- ============================================================================
-- FUNCIÓN PARA AUDITORÍA DE CAMBIOS EN INFORMES DE TESIS
-- ============================================================================

CREATE OR REPLACE FUNCTION auditar_cambio_informe()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO historial_cambios (
            version_documento_id,
            usuario_id,
            tipo_cambio,
            descripcion,
            valor_anterior,
            valor_nuevo
        ) VALUES (
            NULL,
            NEW.creado_por,
            'creacion',
            'Creación de informe de tesis: ' || NEW.titulo,
            NULL,
            jsonb_build_object(
                'titulo', NEW.titulo,
                'estado', NEW.estado,
                'proyecto_tesis_id', NEW.proyecto_tesis_id
            )
        );
    ELSIF TG_OP = 'UPDATE' THEN
        IF OLD.estado <> NEW.estado THEN
            INSERT INTO historial_cambios (
                version_documento_id,
                usuario_id,
                tipo_cambio,
                descripcion,
                valor_anterior,
                valor_nuevo
            ) VALUES (
                NULL,
                COALESCE(NEW.actualizado_por, OLD.actualizado_por),
                'actualizacion',
                'Cambio de estado en informe de tesis',
                jsonb_build_object('estado', OLD.estado),
                jsonb_build_object('estado', NEW.estado)
            );
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger de auditoría para informes_tesis
CREATE TRIGGER trg_informes_tesis_auditar
    AFTER INSERT OR UPDATE ON informes_tesis
    FOR EACH ROW
    EXECUTE FUNCTION auditar_cambio_informe();

-- ============================================================================
-- FUNCIÓN PARA ACTUALIZAR CONTADOR DE ASESORÍAS
-- ============================================================================

CREATE OR REPLACE FUNCTION actualizar_contador_asesorias()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        -- Actualizar carga académica del asesor
        UPDATE asesores 
        SET carga_academica_actual = carga_academica_actual + 1
        WHERE id = NEW.asesor_id;
    ELSIF TG_OP = 'DELETE' THEN
        -- Reducir carga académica del asesor
        UPDATE asesores 
        SET carga_academica_actual = GREATEST(carga_academica_actual - 1, 0)
        WHERE id = OLD.asesor_id;
    END IF;
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar contador de asesorías
CREATE TRIGGER trg_asesorias_actualizar_contador
    AFTER INSERT OR DELETE ON asesorias
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_contador_asesorias();

-- ============================================================================
-- FUNCIÓN PARA ACTUALIZAR CONTADOR DE SUSTENTACIONES DE JURADO
-- ============================================================================

CREATE OR REPLACE FUNCTION actualizar_contador_sustentaciones_jurado()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE jurados 
        SET sustentaciones_participadas = sustentaciones_participadas + 1
        WHERE id = NEW.jurado_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE jurados 
        SET sustentaciones_participadas = GREATEST(sustentaciones_participadas - 1, 0)
        WHERE id = OLD.jurado_id;
    END IF;
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar contador de sustentaciones
CREATE TRIGGER trg_jurados_sustentacion_actualizar_contador
    AFTER INSERT OR DELETE ON jurados_sustentacion
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_contador_sustentaciones_jurado();

-- ============================================================================
-- COMENTARIOS DE TRIGGERS
-- ============================================================================

COMMENT ON FUNCTION actualizar_timestamp() IS 'Función para actualizar automáticamente el campo actualizado_en';
COMMENT ON FUNCTION actualizar_usuario_actualizacion() IS 'Función para actualizar campos de auditoría de usuario';
COMMENT ON FUNCTION auditar_cambio_proyecto() IS 'Función para auditar cambios significativos en proyectos de tesis';
COMMENT ON FUNCTION auditar_cambio_informe() IS 'Función para auditar cambios significativos en informes de tesis';
COMMENT ON FUNCTION actualizar_contador_asesorias() IS 'Función para mantener actualizada la carga académica de asesores';
COMMENT ON FUNCTION actualizar_contador_sustentaciones_jurado() IS 'Función para mantener actualizado el contador de sustentaciones de jurados';
