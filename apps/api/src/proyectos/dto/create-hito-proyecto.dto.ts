import { IsString, IsOptional, IsDate, IsEnum, IsInt } from 'class-validator';
import { EstadoHito } from '../entities/hito-proyecto.entity';

export class CreateHitoProyectoDto {
  @IsString()
  proyecto_id: string;

  @IsString()
  nombre: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsEnum(EstadoHito)
  estado?: EstadoHito;

  @IsOptional()
  @IsDate()
  fecha_limite?: Date;

  @IsOptional()
  @IsInt()
  orden?: number;

  @IsOptional()
  @IsString()
  observaciones?: string;
}
