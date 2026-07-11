import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsOptional, IsUUID } from 'class-validator';

export class CreateAsesorDto {
  @ApiProperty({ description: 'ID del usuario' })
  @IsUUID()
  @IsNotEmpty()
  usuario_id: string;

  @ApiProperty({ description: 'Código de docente' })
  @IsString()
  @IsNotEmpty()
  codigo_docente: string;

  @ApiProperty({ description: 'Categoría', required: false })
  @IsString()
  @IsOptional()
  categoria?: string;

  @ApiProperty({ description: 'Departamento', required: false })
  @IsString()
  @IsOptional()
  departamento?: string;

  @ApiProperty({ description: 'Área de investigación' })
  @IsString()
  @IsNotEmpty()
  area_investigacion: string;

  @ApiProperty({ description: 'Carga académica actual', required: false })
  @IsNumber()
  @IsOptional()
  carga_academica_actual?: number;

  @ApiProperty({ description: 'Tesis dirigidas', required: false })
  @IsNumber()
  @IsOptional()
  tesis_dirigidas?: number;

  @ApiProperty({ description: 'ORCID ID', required: false })
  @IsString()
  @IsOptional()
  orcid_id?: string;

  @ApiProperty({ description: 'Datos de investigación (JSON)', required: false })
  @IsOptional()
  datos_investigacion?: Record<string, any>;
}
