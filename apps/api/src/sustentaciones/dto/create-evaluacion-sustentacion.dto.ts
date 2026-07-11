import { IsString, IsEnum, IsUUID, IsOptional, IsNumber, IsBoolean } from 'class-validator';
import { EstadoEvaluacion } from '../entities/evaluacion-sustentacion.entity';

export class CreateEvaluacionSustentacionDto {
  @IsUUID()
  sustentacion_id: string;

  @IsUUID()
  jurado_id: string;

  @IsOptional()
  @IsEnum(EstadoEvaluacion)
  estado?: EstadoEvaluacion;

  @IsOptional()
  @IsNumber()
  calificacion_total?: number;

  @IsOptional()
  rubrica_evaluacion?: Record<string, any>;

  @IsOptional()
  @IsString()
  comentarios_generales?: string;

  @IsOptional()
  @IsString()
  fortalezas?: string;

  @IsOptional()
  @IsString()
  debilidades?: string;

  @IsOptional()
  @IsString()
  recomendaciones?: string;

  @IsOptional()
  @IsBoolean()
  aprobado?: boolean;
}
