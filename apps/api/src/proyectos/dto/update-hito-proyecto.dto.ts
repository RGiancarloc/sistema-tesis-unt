import { PartialType } from '@nestjs/swagger';
import { CreateHitoProyectoDto } from './create-hito-proyecto.dto';

export class UpdateHitoProyectoDto extends PartialType(CreateHitoProyectoDto) {}
