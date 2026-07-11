import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  IsNumberString,
  MaxLength as MaxLengthStr,
} from 'class-validator';

export class CreateUsuarioDto {
  @ApiProperty({ description: 'Correo institucional' })
  @IsEmail()
  @IsNotEmpty()
  correo_institucional: string;

  @ApiProperty({ description: 'Contraseña' })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  contrasena: string;

  @ApiProperty({ description: 'Nombres' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombres: string;

  @ApiProperty({ description: 'Apellido paterno' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  apellido_paterno: string;

  @ApiProperty({ description: 'Apellido materno', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  apellido_materno?: string;

  @ApiProperty({ description: 'DNI', required: false })
  @IsNumberString()
  @IsOptional()
  @MaxLengthStr(8)
  dni?: string;

  @ApiProperty({ description: 'Teléfono', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(20)
  telefono?: string;

  @ApiProperty({ description: 'Nombre del rol', required: false })
  @IsString()
  @IsOptional()
  rol_nombre?: string;
}
