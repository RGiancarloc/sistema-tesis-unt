import { PartialType } from '@nestjs/swagger';
import { CreateRevisionInformeDto } from './create-revision-informe.dto';

export class UpdateRevisionInformeDto extends PartialType(CreateRevisionInformeDto) {}
