import { PartialType } from '@nestjs/swagger';
import { CreateJuradoDto } from './create-jurado.dto';

export class UpdateJuradoDto extends PartialType(CreateJuradoDto) {}
