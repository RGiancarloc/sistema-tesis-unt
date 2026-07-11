import { IsString, IsOptional, IsEnum, IsUUID, IsDate, IsInt } from 'class-validator';
import { EstadoInforme } from '../entities/informe-tesis.entity';

export class CreateInformeTesisDto {
  @IsUUID()
  proyecto_id: string;

  @IsString()
  titulo: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsEnum(EstadoInforme)
  estado?: EstadoInforme;

  @IsOptional()
  @IsDate()
  fecha_inicio?: Date;

  @IsOptional()
  @IsDate()
  fecha_limite?: Date;

  @IsOptional()
  metadatos?: Record<string, any>;
}
