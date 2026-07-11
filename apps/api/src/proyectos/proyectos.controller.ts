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
import { ProyectosService } from './proyectos.service';
import { CreateProyectoTesisDto } from './dto/create-proyecto-tesis.dto';
import { UpdateProyectoTesisDto } from './dto/update-proyecto-tesis.dto';
import { CreateAsesoriaDto } from './dto/create-asesoria.dto';
import { UpdateAsesoriaDto } from './dto/update-asesoria.dto';
import { CreateHitoProyectoDto } from './dto/create-hito-proyecto.dto';
import { UpdateHitoProyectoDto } from './dto/update-hito-proyecto.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('proyectos')
@Controller('proyectos')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ProyectosController {
  constructor(private readonly proyectosService: ProyectosService) {}

  // Proyectos de Tesis
  @Post()
  @Roles('ESTUDIANTE', 'COORDINADOR')
  @ApiOperation({ summary: 'Crear un nuevo proyecto de tesis' })
  @ApiResponse({ status: 201, description: 'Proyecto creado exitosamente' })
  createProyecto(@Body() createProyectoDto: CreateProyectoTesisDto) {
    return this.proyectosService.createProyecto(createProyectoDto);
  }

  @Get()
  @Roles('ADMINISTRADOR', 'DECANO', 'COORDINADOR', 'ASESOR')
  @ApiOperation({ summary: 'Obtener todos los proyectos de tesis' })
  findAllProyectos() {
    return this.proyectosService.findAllProyectos();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un proyecto por ID' })
  findOneProyecto(@Param('id') id: string) {
    return this.proyectosService.findProyectoById(id);
  }

  @Get('estudiante/:estudianteId')
  @Roles('ESTUDIANTE')
  @ApiOperation({ summary: 'Obtener proyectos de un estudiante' })
  findProyectosByEstudiante(@Param('estudianteId') estudianteId: string) {
    return this.proyectosService.findProyectosByEstudiante(estudianteId);
  }

  @Get('asesor/:asesorId')
  @Roles('ASESOR')
  @ApiOperation({ summary: 'Obtener proyectos asignados a un asesor' })
  findProyectosByAsesor(@Param('asesorId') asesorId: string) {
    return this.proyectosService.findProyectosByAsesor(asesorId);
  }

  @Patch(':id')
  @Roles('ESTUDIANTE', 'COORDINADOR')
  @ApiOperation({ summary: 'Actualizar un proyecto' })
  updateProyecto(
    @Param('id') id: string,
    @Body() updateProyectoDto: UpdateProyectoTesisDto,
  ) {
    return this.proyectosService.updateProyecto(id, updateProyectoDto);
  }

  @Delete(':id')
  @Roles('ADMINISTRADOR', 'COORDINADOR')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un proyecto (soft delete)' })
  removeProyecto(@Param('id') id: string) {
    return this.proyectosService.removeProyecto(id);
  }

  // Workflow
  @Post(':id/enviar-asesor')
  @Roles('ESTUDIANTE')
  @ApiOperation({ summary: 'Enviar proyecto a asesor para revisión' })
  enviarAAesor(@Param('id') id: string) {
    return this.proyectosService.enviarAAesor(id);
  }

  @Post(':id/aprobar-asesor')
  @Roles('ASESOR')
  @ApiOperation({ summary: 'Aprobar proyecto como asesor' })
  aprobarPorAsesor(
    @Param('id') id: string,
    @Body('comentario') comentario?: string,
  ) {
    return this.proyectosService.aprobarPorAsesor(id, comentario);
  }

  @Post(':id/rechazar-asesor')
  @Roles('ASESOR')
  @ApiOperation({ summary: 'Rechazar proyecto como asesor' })
  rechazarPorAsesor(
    @Param('id') id: string,
    @Body('comentario') comentario: string,
  ) {
    return this.proyectosService.rechazarPorAsesor(id, comentario);
  }

  @Post(':id/enviar-coordinador')
  @Roles('ASESOR')
  @ApiOperation({ summary: 'Enviar proyecto a coordinador' })
  enviarACoordinador(@Param('id') id: string) {
    return this.proyectosService.enviarACoordinador(id);
  }

  @Post(':id/aprobar-coordinador')
  @Roles('COORDINADOR')
  @ApiOperation({ summary: 'Aprobar proyecto como coordinador' })
  aprobarPorCoordinador(
    @Param('id') id: string,
    @Body('comentario') comentario?: string,
  ) {
    return this.proyectosService.aprobarPorCoordinador(id, comentario);
  }

  @Post(':id/rechazar-coordinador')
  @Roles('COORDINADOR')
  @ApiOperation({ summary: 'Rechazar proyecto como coordinador' })
  rechazarPorCoordinador(
    @Param('id') id: string,
    @Body('comentario') comentario: string,
  ) {
    return this.proyectosService.rechazarPorCoordinador(id, comentario);
  }

  @Post(':id/asignar-asesor')
  @Roles('COORDINADOR')
  @ApiOperation({ summary: 'Asignar asesor a un proyecto' })
  asignarAsesor(
    @Param('id') id: string,
    @Body('asesor_id') asesorId: string,
  ) {
    return this.proyectosService.asignarAsesor(id, asesorId);
  }

  // Asesorías
  @Post('asesorias')
  @Roles('ESTUDIANTE', 'ASESOR')
  @ApiOperation({ summary: 'Crear una asesoría' })
  createAsesoria(@Body() createAsesoriaDto: CreateAsesoriaDto) {
    return this.proyectosService.createAsesoria(createAsesoriaDto);
  }

  @Get('asesorias/proyecto/:proyectoId')
  @ApiOperation({ summary: 'Obtener asesorías de un proyecto' })
  findAsesoriasByProyecto(@Param('proyectoId') proyectoId: string) {
    return this.proyectosService.findAsesoriasByProyecto(proyectoId);
  }

  @Get('asesorias/asesor/:asesorId')
  @Roles('ASESOR')
  @ApiOperation({ summary: 'Obtener asesorías de un asesor' })
  findAsesoriasByAsesor(@Param('asesorId') asesorId: string) {
    return this.proyectosService.findAsesoriasByAsesor(asesorId);
  }

  @Patch('asesorias/:id')
  @Roles('ESTUDIANTE', 'ASESOR')
  @ApiOperation({ summary: 'Actualizar una asesoría' })
  updateAsesoria(
    @Param('id') id: string,
    @Body() updateAsesoriaDto: UpdateAsesoriaDto,
  ) {
    return this.proyectosService.updateAsesoria(id, updateAsesoriaDto);
  }

  @Post('asesorias/:id/completar')
  @Roles('ASESOR')
  @ApiOperation({ summary: 'Completar una asesoría' })
  completarAsesoria(
    @Param('id') id: string,
    @Body('conclusiones') conclusiones: string,
  ) {
    return this.proyectosService.completarAsesoria(id, conclusiones);
  }

  @Delete('asesorias/:id')
  @Roles('ESTUDIANTE', 'ASESOR')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar una asesoría' })
  removeAsesoria(@Param('id') id: string) {
    return this.proyectosService.removeAsesoria(id);
  }

  // Hitos
  @Post('hitos')
  @Roles('ESTUDIANTE', 'COORDINADOR')
  @ApiOperation({ summary: 'Crear un hito del proyecto' })
  createHito(@Body() createHitoDto: CreateHitoProyectoDto) {
    return this.proyectosService.createHito(createHitoDto);
  }

  @Get('hitos/proyecto/:proyectoId')
  @ApiOperation({ summary: 'Obtener hitos de un proyecto' })
  findHitosByProyecto(@Param('proyectoId') proyectoId: string) {
    return this.proyectosService.findAllHitosByProyecto(proyectoId);
  }

  @Patch('hitos/:id')
  @Roles('ESTUDIANTE', 'COORDINADOR')
  @ApiOperation({ summary: 'Actualizar un hito' })
  updateHito(
    @Param('id') id: string,
    @Body() updateHitoDto: UpdateHitoProyectoDto,
  ) {
    return this.proyectosService.updateHito(id, updateHitoDto);
  }

  @Post('hitos/:id/completar')
  @Roles('ESTUDIANTE', 'COORDINADOR')
  @ApiOperation({ summary: 'Completar un hito' })
  completarHito(@Param('id') id: string) {
    return this.proyectosService.completarHito(id);
  }

  @Delete('hitos/:id')
  @Roles('ESTUDIANTE', 'COORDINADOR')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un hito' })
  removeHito(@Param('id') id: string) {
    return this.proyectosService.removeHito(id);
  }
}
