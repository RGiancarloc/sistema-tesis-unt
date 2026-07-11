import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsDate, IsOptional, IsUUID } from 'class-validator';

export class CreateEstudianteDto {
  @ApiProperty({ description: 'ID del usuario' })
  @IsUUID()
  @IsNotEmpty()
  usuario_id: string;

  @ApiProperty({ description: 'Código de estudiante' })
  @IsString()
  @IsNotEmpty()
  codigo_estudiante: string;

  @ApiProperty({ description: 'Programa de estudios' })
  @IsString()
  @IsNotEmpty()
  programa_estudios: string;

  @ApiProperty({ description: 'Facultad' })
  @IsString()
  @IsNotEmpty()
  facultad: string;

  @ApiProperty({ description: 'Fecha de ingreso' })
  @IsDate()
  @IsNotEmpty()
  fecha_ingreso: Date;

  @ApiProperty({ description: 'Fecha de egreso estimada', required: false })
  @IsDate()
  @IsOptional()
  fecha_egreso_estimada?: Date;

  @ApiProperty({ description: 'ORCID ID', required: false })
  @IsString()
  @IsOptional()
  orcid_id?: string;

  @ApiProperty({ description: 'Datos académicos (JSON)', required: false })
  @IsOptional()
  datos_academicos?: Record<string, any>;
}
