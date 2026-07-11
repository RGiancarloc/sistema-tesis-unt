import { IsString, IsOptional, IsArray, IsEnum, IsDate, IsUUID } from 'class-validator';
import { EstadoProyecto } from '../entities/proyecto-tesis.entity';

export class CreateProyectoTesisDto {
  @IsUUID()
  estudiante_id: string;

  @IsOptional()
  @IsUUID()
  asesor_id?: string;

  @IsString()
  titulo: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsString()
  problema_investigacion?: string;

  @IsOptional()
  @IsString()
  objetivos?: string;

  @IsOptional()
  @IsString()
  justificacion?: string;

  @IsOptional()
  @IsString()
  metodologia?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  palabras_clave?: string[];

  @IsOptional()
  @IsEnum(EstadoProyecto)
  estado?: EstadoProyecto;

  @IsOptional()
  @IsDate()
  fecha_inicio?: Date;

  @IsOptional()
  @IsDate()
  fecha_fin_estimada?: Date;

  @IsOptional()
  metadatos?: Record<string, any>;
}
