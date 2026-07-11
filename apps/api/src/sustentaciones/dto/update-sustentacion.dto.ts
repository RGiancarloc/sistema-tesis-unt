import { PartialType } from '@nestjs/swagger';
import { CreateSustentacionDto } from './create-sustentacion.dto';

export class UpdateSustentacionDto extends PartialType(CreateSustentacionDto) {}
