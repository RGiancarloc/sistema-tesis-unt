import { PartialType } from '@nestjs/swagger';
import { CreateEvaluacionSustentacionDto } from './create-evaluacion-sustentacion.dto';

export class UpdateEvaluacionSustentacionDto extends PartialType(CreateEvaluacionSustentacionDto) {}
