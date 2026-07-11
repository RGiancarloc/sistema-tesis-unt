import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsBoolean, IsNumber, IsOptional, IsUUID } from 'class-validator';

export class CreateJuradoDto {
  @ApiProperty({ description: 'ID del usuario' })
  @IsUUID()
  @IsNotEmpty()
  usuario_id: string;

  @ApiProperty({ description: 'Código de docente' })
  @IsString()
  @IsNotEmpty()
  codigo_docente: string;

  @ApiProperty({ description: 'Especialidad' })
  @IsString()
  @IsNotEmpty()
  especialidad: string;

  @ApiProperty({ description: 'Es doctor', required: false })
  @IsBoolean()
  @IsOptional()
  es_doctor?: boolean;

  @ApiProperty({ description: 'Sustentaciones participadas', required: false })
  @IsNumber()
  @IsOptional()
  sustentaciones_participadas?: number;

  @ApiProperty({ description: 'Datos de jurado (JSON)', required: false })
  @IsOptional()
  datos_jurado?: Record<string, any>;
}
