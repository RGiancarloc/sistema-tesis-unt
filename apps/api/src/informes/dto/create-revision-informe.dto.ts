import { IsString, IsEnum, IsUUID, IsOptional, IsBoolean } from 'class-validator';
import { EstadoRevision } from '../entities/revision-informe.entity';

export class CreateRevisionInformeDto {
  @IsUUID()
  informe_id: string;

  @IsUUID()
  revisor_id: string;

  @IsOptional()
  @IsUUID()
  version_informe_id?: string;

  @IsOptional()
  @IsEnum(EstadoRevision)
  estado?: EstadoRevision;

  @IsOptional()
  @IsString()
  comentarios?: string;

  @IsOptional()
  @IsString()
  observaciones?: string;

  @IsOptional()
  correcciones?: Record<string, any>;

  @IsOptional()
  @IsBoolean()
  conformidad?: boolean;

  @IsOptional()
  @IsString()
  notas?: string;
}
