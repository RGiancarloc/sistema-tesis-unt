import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { InformesService } from './informes.service';
import { CreateInformeTesisDto } from './dto/create-informe-tesis.dto';
import { UpdateInformeTesisDto } from './dto/update-informe-tesis.dto';
import { CreateVersionInformeDto } from './dto/create-version-informe.dto';
import { UpdateVersionInformeDto } from './dto/update-version-informe.dto';
import { CreateRevisionInformeDto } from './dto/create-revision-informe.dto';
import { UpdateRevisionInformeDto } from './dto/update-revision-informe.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('informes')
@Controller('informes')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class InformesController {
  constructor(private readonly informesService: InformesService) {}

  // Informes de Tesis
  @Post()
  @Roles('ESTUDIANTE', 'COORDINADOR')
  @ApiOperation({ summary: 'Crear un nuevo informe de tesis' })
  @ApiResponse({ status: 201, description: 'Informe creado exitosamente' })
  createInforme(@Body() createInformeDto: CreateInformeTesisDto) {
    return this.informesService.createInforme(createInformeDto);
  }

  @Get()
  @Roles('ADMINISTRADOR', 'DECANO', 'COORDINADOR', 'ASESOR')
  @ApiOperation({ summary: 'Obtener todos los informes de tesis' })
  findAllInformes() {
    return this.informesService.findAllInformes();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un informe por ID' })
  findOneInforme(@Param('id') id: string) {
    return this.informesService.findInformeById(id);
  }

  @Get('proyecto/:proyectoId')
  @Roles('ESTUDIANTE', 'ASESOR', 'COORDINADOR')
  @ApiOperation({ summary: 'Obtener informes de un proyecto' })
  findInformesByProyecto(@Param('proyectoId') proyectoId: string) {
    return this.informesService.findInformesByProyecto(proyectoId);
  }

  @Patch(':id')
  @Roles('ESTUDIANTE', 'COORDINADOR')
  @ApiOperation({ summary: 'Actualizar un informe' })
  updateInforme(
    @Param('id') id: string,
    @Body() updateInformeDto: UpdateInformeTesisDto,
  ) {
    return this.informesService.updateInforme(id, updateInformeDto);
  }

  @Delete(':id')
  @Roles('ADMINISTRADOR', 'COORDINADOR')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un informe (soft delete)' })
  removeInforme(@Param('id') id: string) {
    return this.informesService.removeInforme(id);
  }

  // Workflow de Informes
  @Post(':id/enviar-revision')
  @Roles('ESTUDIANTE')
  @ApiOperation({ summary: 'Enviar informe a revisión' })
  enviarRevision(@Param('id') id: string) {
    return this.informesService.enviarRevision(id);
  }

  @Post(':id/aprobar')
  @Roles('ASESOR')
  @ApiOperation({ summary: 'Aprobar informe' })
  aprobarInforme(
    @Param('id') id: string,
    @Body('comentario') comentario?: string,
  ) {
    return this.informesService.aprobarInforme(id, comentario);
  }

  @Post(':id/rechazar')
  @Roles('ASESOR')
  @ApiOperation({ summary: 'Rechazar informe' })
  rechazarInforme(
    @Param('id') id: string,
    @Body('comentario') comentario: string,
  ) {
    return this.informesService.rechazarInforme(id, comentario);
  }

  @Post(':id/finalizar')
  @Roles('COORDINADOR', 'ESTUDIANTE')
  @ApiOperation({ summary: 'Finalizar informe' })
  finalizarInforme(@Param('id') id: string) {
    return this.informesService.finalizarInforme(id);
  }

  // Versiones de Informe
  @Post('versiones')
  @Roles('ESTUDIANTE', 'COORDINADOR')
  @ApiOperation({ summary: 'Crear una versión de informe' })
  createVersion(@Body() createVersionDto: CreateVersionInformeDto) {
    return this.informesService.createVersion(createVersionDto);
  }

  @Get('versiones/informe/:informeId')
  @ApiOperation({ summary: 'Obtener versiones de un informe' })
  findVersionsByInforme(@Param('informeId') informeId: string) {
    return this.informesService.findVersionsByInforme(informeId);
  }

  @Get('versiones/latest/:informeId')
  @ApiOperation({ summary: 'Obtener la última versión de un informe' })
  findLatestVersion(@Param('informeId') informeId: string) {
    return this.informesService.findLatestVersion(informeId);
  }

  @Patch('versiones/:id')
  @Roles('ESTUDIANTE', 'COORDINADOR')
  @ApiOperation({ summary: 'Actualizar una versión' })
  updateVersion(
    @Param('id') id: string,
    @Body() updateVersionDto: UpdateVersionInformeDto,
  ) {
    return this.informesService.updateVersion(id, updateVersionDto);
  }

  @Delete('versiones/:id')
  @Roles('ESTUDIANTE', 'COORDINADOR')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar una versión' })
  removeVersion(@Param('id') id: string) {
    return this.informesService.removeVersion(id);
  }

  // Revisiones de Informe
  @Post('revisiones')
  @Roles('COORDINADOR', 'ASESOR')
  @ApiOperation({ summary: 'Crear una revisión de informe' })
  createRevision(@Body() createRevisionDto: CreateRevisionInformeDto) {
    return this.informesService.createRevision(createRevisionDto);
  }

  @Get('revisiones/informe/:informeId')
  @ApiOperation({ summary: 'Obtener revisiones de un informe' })
  findRevisionsByInforme(@Param('informeId') informeId: string) {
    return this.informesService.findRevisionsByInforme(informeId);
  }

  @Get('revisiones/revisor/:revisorId')
  @Roles('ASESOR')
  @ApiOperation({ summary: 'Obtener revisiones de un revisor' })
  findRevisionsByRevisor(@Param('revisorId') revisorId: string) {
    return this.informesService.findRevisionsByRevisor(revisorId);
  }

  @Patch('revisiones/:id')
  @Roles('ASESOR', 'COORDINADOR')
  @ApiOperation({ summary: 'Actualizar una revisión' })
  updateRevision(
    @Param('id') id: string,
    @Body() updateRevisionDto: UpdateRevisionInformeDto,
  ) {
    return this.informesService.updateRevision(id, updateRevisionDto);
  }

  @Post('revisiones/:id/iniciar')
  @Roles('ASESOR')
  @ApiOperation({ summary: 'Iniciar una revisión' })
  iniciarRevision(@Param('id') id: string) {
    return this.informesService.iniciarRevision(id);
  }

  @Post('revisiones/:id/completar')
  @Roles('ASESOR')
  @ApiOperation({ summary: 'Completar una revisión' })
  completarRevision(
    @Param('id') id: string,
    @Body('comentarios') comentarios: string,
    @Body('conformidad') conformidad: boolean,
  ) {
    return this.informesService.completarRevision(id, comentarios, conformidad);
  }

  @Post('revisiones/:id/aprobar')
  @Roles('COORDINADOR')
  @ApiOperation({ summary: 'Aprobar una revisión' })
  aprobarRevision(@Param('id') id: string) {
    return this.informesService.aprobarRevision(id);
  }

  @Post('revisiones/:id/rechazar')
  @Roles('COORDINADOR')
  @ApiOperation({ summary: 'Rechazar una revisión' })
  rechazarRevision(
    @Param('id') id: string,
    @Body('motivo') motivo: string,
  ) {
    return this.informesService.rechazarRevision(id, motivo);
  }

  @Delete('revisiones/:id')
  @Roles('COORDINADOR', 'ASESOR')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar una revisión' })
  removeRevision(@Param('id') id: string) {
    return this.informesService.removeRevision(id);
  }
}
