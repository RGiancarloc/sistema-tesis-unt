import { IsString, IsOptional, IsEnum, IsUUID, IsDate, IsInt } from 'class-validator';
import { EstadoSustentacion, ModalidadSustentacion } from '../entities/sustentacion.entity';

export class CreateSustentacionDto {
  @IsUUID()
  proyecto_id: string;

  @IsString()
  titulo: string;

  @IsOptional()
  @IsEnum(EstadoSustentacion)
  estado?: EstadoSustentacion;

  @IsOptional()
  @IsEnum(ModalidadSustentacion)
  modalidad?: ModalidadSustentacion;

  @IsDate()
  fecha_programada: Date;

  @IsOptional()
  @IsString()
  ubicacion?: string;

  @IsOptional()
  @IsString()
  enlace_virtual?: string;

  @IsOptional()
  @IsInt()
  duracion_minutos?: number;

  @IsOptional()
  @IsString()
  observaciones?: string;

  @IsOptional()
  metadatos?: Record<string, any>;
}
