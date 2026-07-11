import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  Matches,
  IsOptional,
  IsNumberString,
  MaxLength as MaxLengthStr,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    description: 'Correo institucional del usuario',
    example: 'estudiante@unt.edu.pe',
  })
  @IsEmail({}, { message: 'Debe ser un correo electrónico válido' })
  @IsNotEmpty({ message: 'El correo es requerido' })
  correo_institucional: string;

  @ApiProperty({
    description: 'Contraseña del usuario',
    example: 'Password123!',
    minLength: 8,
  })
  @IsString()
  @IsNotEmpty({ message: 'La contraseña es requerida' })
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @MaxLength(100, { message: 'La contraseña no puede exceder 100 caracteres' })
  contrasena: string;

  @ApiProperty({
    description: 'Nombres del usuario',
    example: 'Juan Carlos',
  })
  @IsString()
  @IsNotEmpty({ message: 'Los nombres son requeridos' })
  @MaxLength(100, { message: 'Los nombres no pueden exceder 100 caracteres' })
  nombres: string;

  @ApiProperty({
    description: 'Apellido paterno del usuario',
    example: 'Pérez',
  })
  @IsString()
  @IsNotEmpty({ message: 'El apellido paterno es requerido' })
  @MaxLength(100, { message: 'El apellido paterno no puede exceder 100 caracteres' })
  apellido_paterno: string;

  @ApiProperty({
    description: 'Apellido materno del usuario',
    example: 'López',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(100, { message: 'El apellido materno no puede exceder 100 caracteres' })
  apellido_materno?: string;

  @ApiProperty({
    description: 'DNI del usuario (8 dígitos)',
    example: '12345678',
    required: false,
  })
  @IsNumberString({}, { message: 'El DNI debe ser numérico' })
  @IsOptional()
  @MaxLengthStr(8, { message: 'El DNI debe tener 8 dígitos' })
  @Matches(/^\d{8}$/, { message: 'El DNI debe tener exactamente 8 dígitos' })
  dni?: string;

  @ApiProperty({
    description: 'Teléfono del usuario',
    example: '+51912345678',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(20, { message: 'El teléfono no puede exceder 20 caracteres' })
  telefono?: string;
}
