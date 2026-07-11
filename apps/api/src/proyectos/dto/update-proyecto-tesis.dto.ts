import { PartialType } from '@nestjs/swagger';
import { CreateProyectoTesisDto } from './create-proyecto-tesis.dto';

export class UpdateProyectoTesisDto extends PartialType(CreateProyectoTesisDto) {}
