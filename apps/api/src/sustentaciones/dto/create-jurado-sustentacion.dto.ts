import { IsString, IsEnum, IsUUID, IsOptional } from 'class-validator';
import { RolJurado, EstadoJurado } from '../entities/jurado-sustentacion.entity';

export class CreateJuradoSustentacionDto {
  @IsUUID()
  sustentacion_id: string;

  @IsUUID()
  jurado_id: string;

  @IsEnum(RolJurado)
  rol: RolJurado;

  @IsOptional()
  @IsEnum(EstadoJurado)
  estado?: EstadoJurado;

  @IsOptional()
  @IsString()
  observaciones?: string;
}
