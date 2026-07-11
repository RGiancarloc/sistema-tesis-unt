import { PartialType } from '@nestjs/swagger';
import { CreateVersionInformeDto } from './create-version-informe.dto';

export class UpdateVersionInformeDto extends PartialType(CreateVersionInformeDto) {}
