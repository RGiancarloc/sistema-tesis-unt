import { PartialType } from '@nestjs/swagger';
import { CreateInformeTesisDto } from './create-informe-tesis.dto';

export class UpdateInformeTesisDto extends PartialType(CreateInformeTesisDto) {}
