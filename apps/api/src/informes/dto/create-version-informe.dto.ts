import { IsString, IsInt, IsEnum, IsUUID, IsOptional } from 'class-validator';
import { TipoArchivo } from '../entities/version-informe.entity';

export class CreateVersionInformeDto {
  @IsUUID()
  informe_id: string;

  @IsInt()
  numero_version: number;

  @IsString()
  nombre_archivo: string;

  @IsString()
  ruta_archivo: string;

  @IsString()
  url_archivo: string;

  @IsInt()
  tamano_bytes: number;

  @IsEnum(TipoArchivo)
  tipo_archivo: TipoArchivo;

  @IsOptional()
  @IsString()
  hash_archivo?: string;

  @IsOptional()
  @IsString()
  notas_version?: string;
}
