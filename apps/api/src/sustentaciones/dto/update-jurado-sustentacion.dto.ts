import { PartialType } from '@nestjs/swagger';
import { CreateJuradoSustentacionDto } from './create-jurado-sustentacion.dto';

export class UpdateJuradoSustentacionDto extends PartialType(CreateJuradoSustentacionDto) {}
