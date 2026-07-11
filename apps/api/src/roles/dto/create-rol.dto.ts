import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, IsOptional } from 'class-validator';

export class CreateRolDto {
  @ApiProperty({ description: 'Nombre del rol' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  nombre: string;

  @ApiProperty({ description: 'Descripción', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  descripcion?: string;

  @ApiProperty({ description: 'Permisos (JSON)', required: false })
  @IsOptional()
  permisos?: Record<string, any>;
}
