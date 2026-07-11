import { IsString, IsDate, IsEnum, IsUUID, IsOptional, IsInt } from 'class-validator';
import { TipoAsesoria, EstadoAsesoria } from '../entities/asesoria.entity';

export class CreateAsesoriaDto {
  @IsUUID()
  proyecto_id: string;

  @IsUUID()
  asesor_id: string;

  @IsEnum(TipoAsesoria)
  tipo: TipoAsesoria;

  @IsDate()
  fecha_programada: Date;

  @IsOptional()
  @IsEnum(EstadoAsesoria)
  estado?: EstadoAsesoria;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsString()
  observaciones?: string;

  @IsOptional()
  @IsString()
  conclusiones?: string;

  @IsOptional()
  @IsInt()
  duracion_minutos?: number;
}
