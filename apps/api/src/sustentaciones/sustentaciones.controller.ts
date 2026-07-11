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
import { SustentacionesService } from './sustentaciones.service';
import { CreateSustentacionDto } from './dto/create-sustentacion.dto';
import { UpdateSustentacionDto } from './dto/update-sustentacion.dto';
import { CreateJuradoSustentacionDto } from './dto/create-jurado-sustentacion.dto';
import { UpdateJuradoSustentacionDto } from './dto/update-jurado-sustentacion.dto';
import { CreateEvaluacionSustentacionDto } from './dto/create-evaluacion-sustentacion.dto';
import { UpdateEvaluacionSustentacionDto } from './dto/update-evaluacion-sustentacion.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('sustentaciones')
@Controller('sustentaciones')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class SustentacionesController {
  constructor(private readonly sustentacionesService: SustentacionesService) {}

  // Sustentaciones
  @Post()
  @Roles('COORDINADOR', 'DECANO')
  @ApiOperation({ summary: 'Crear una nueva sustentación' })
  @ApiResponse({ status: 201, description: 'Sustentación creada exitosamente' })
  createSustentacion(@Body() createSustentacionDto: CreateSustentacionDto) {
    return this.sustentacionesService.createSustentacion(createSustentacionDto);
  }

  @Get()
  @Roles('ADMINISTRADOR', 'DECANO', 'COORDINADOR', 'ASESOR', 'JURADO')
  @ApiOperation({ summary: 'Obtener todas las sustentaciones' })
  findAllSustentaciones() {
    return this.sustentacionesService.findAllSustentaciones();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una sustentación por ID' })
  findOneSustentacion(@Param('id') id: string) {
    return this.sustentacionesService.findSustentacionById(id);
  }

  @Get('proyecto/:proyectoId')
  @Roles('ESTUDIANTE', 'ASESOR', 'COORDINADOR')
  @ApiOperation({ summary: 'Obtener sustentaciones de un proyecto' })
  findSustentacionesByProyecto(@Param('proyectoId') proyectoId: string) {
    return this.sustentacionesService.findSustentacionesByProyecto(proyectoId);
  }

  @Patch(':id')
  @Roles('COORDINADOR', 'DECANO')
  @ApiOperation({ summary: 'Actualizar una sustentación' })
  updateSustentacion(
    @Param('id') id: string,
    @Body() updateSustentacionDto: UpdateSustentacionDto,
  ) {
    return this.sustentacionesService.updateSustentacion(id, updateSustentacionDto);
  }

  @Delete(':id')
  @Roles('ADMINISTRADOR', 'COORDINADOR')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar una sustentación (soft delete)' })
  removeSustentacion(@Param('id') id: string) {
    return this.sustentacionesService.removeSustentacion(id);
  }

  // Workflow de Sustentaciones
  @Post(':id/iniciar')
  @Roles('COORDINADOR', 'DECANO')
  @ApiOperation({ summary: 'Iniciar una sustentación' })
  iniciarSustentacion(@Param('id') id: string) {
    return this.sustentacionesService.iniciarSustentacion(id);
  }

  @Post(':id/suspender')
  @Roles('COORDINADOR', 'DECANO')
  @ApiOperation({ summary: 'Suspender una sustentación' })
  suspenderSustentacion(
    @Param('id') id: string,
    @Body('motivo') motivo: string,
  ) {
    return this.sustentacionesService.suspenderSustentacion(id, motivo);
  }

  @Post(':id/aprobar')
  @Roles('COORDINADOR', 'DECANO')
  @ApiOperation({ summary: 'Aprobar una sustentación' })
  aprobarSustentacion(@Param('id') id: string) {
    return this.sustentacionesService.aprobarSustentacion(id);
  }

  @Post(':id/reprobar')
  @Roles('COORDINADOR', 'DECANO')
  @ApiOperation({ summary: 'Reprobar una sustentación' })
  reprobarSustentacion(@Param('id') id: string) {
    return this.sustentacionesService.reprobarSustentacion(id);
  }

  @Post(':id/generar-acta')
  @Roles('COORDINADOR', 'DECANO')
  @ApiOperation({ summary: 'Generar acta de sustentación' })
  generarActa(
    @Param('id') id: string,
    @Body('actaUrl') actaUrl: string,
  ) {
    return this.sustentacionesService.generarActa(id, actaUrl);
  }

  // Jurados de Sustentación
  @Post('jurados')
  @Roles('COORDINADOR')
  @ApiOperation({ summary: 'Asignar jurado a sustentación' })
  createJuradoSustentacion(@Body() createJuradoDto: CreateJuradoSustentacionDto) {
    return this.sustentacionesService.createJuradoSustentacion(createJuradoDto);
  }

  @Get('jurados/sustentacion/:sustentacionId')
  @ApiOperation({ summary: 'Obtener jurados de una sustentación' })
  findJuradosBySustentacion(@Param('sustentacionId') sustentacionId: string) {
    return this.sustentacionesService.findJuradosBySustentacion(sustentacionId);
  }

  @Get('jurados/jurado/:juradoId')
  @Roles('JURADO')
  @ApiOperation({ summary: 'Obtener sustentaciones de un jurado' })
  findJuradosByJurado(@Param('juradoId') juradoId: string) {
    return this.sustentacionesService.findJuradosByJurado(juradoId);
  }

  @Patch('jurados/:id')
  @Roles('COORDINADOR')
  @ApiOperation({ summary: 'Actualizar jurado de sustentación' })
  updateJuradoSustentacion(
    @Param('id') id: string,
    @Body() updateJuradoDto: UpdateJuradoSustentacionDto,
  ) {
    return this.sustentacionesService.updateJuradoSustentacion(id, updateJuradoDto);
  }

  @Post('jurados/:id/aceptar')
  @Roles('JURADO')
  @ApiOperation({ summary: 'Aceptar asignación como jurado' })
  aceptarJurado(@Param('id') id: string) {
    return this.sustentacionesService.aceptarJurado(id);
  }

  @Post('jurados/:id/rechazar')
  @Roles('JURADO')
  @ApiOperation({ summary: 'Rechazar asignación como jurado' })
  rechazarJurado(
    @Param('id') id: string,
    @Body('motivo') motivo: string,
  ) {
    return this.sustentacionesService.rechazarJurado(id, motivo);
  }

  @Delete('jurados/:id')
  @Roles('COORDINADOR')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar jurado de sustentación' })
  removeJuradoSustentacion(@Param('id') id: string) {
    return this.sustentacionesService.removeJuradoSustentacion(id);
  }

  // Evaluaciones de Sustentación
  @Post('evaluaciones')
  @Roles('COORDINADOR', 'JURADO')
  @ApiOperation({ summary: 'Crear evaluación de sustentación' })
  createEvaluacion(@Body() createEvaluacionDto: CreateEvaluacionSustentacionDto) {
    return this.sustentacionesService.createEvaluacion(createEvaluacionDto);
  }

  @Get('evaluaciones/sustentacion/:sustentacionId')
  @ApiOperation({ summary: 'Obtener evaluaciones de una sustentación' })
  findEvaluacionesBySustentacion(@Param('sustentacionId') sustentacionId: string) {
    return this.sustentacionesService.findEvaluacionesBySustentacion(sustentacionId);
  }

  @Get('evaluaciones/jurado/:juradoId')
  @Roles('JURADO')
  @ApiOperation({ summary: 'Obtener evaluaciones de un jurado' })
  findEvaluacionesByJurado(@Param('juradoId') juradoId: string) {
    return this.sustentacionesService.findEvaluacionesByJurado(juradoId);
  }

  @Patch('evaluaciones/:id')
  @Roles('JURADO', 'COORDINADOR')
  @ApiOperation({ summary: 'Actualizar evaluación' })
  updateEvaluacion(
    @Param('id') id: string,
    @Body() updateEvaluacionDto: UpdateEvaluacionSustentacionDto,
  ) {
    return this.sustentacionesService.updateEvaluacion(id, updateEvaluacionDto);
  }

  @Post('evaluaciones/:id/iniciar')
  @Roles('JURADO')
  @ApiOperation({ summary: 'Iniciar evaluación' })
  iniciarEvaluacion(@Param('id') id: string) {
    return this.sustentacionesService.iniciarEvaluacion(id);
  }

  @Post('evaluaciones/:id/completar')
  @Roles('JURADO')
  @ApiOperation({ summary: 'Completar evaluación' })
  completarEvaluacion(
    @Param('id') id: string,
    @Body('calificacionTotal') calificacionTotal: number,
    @Body('rubrica') rubrica: Record<string, any>,
    @Body('comentarios') comentarios: string,
  ) {
    return this.sustentacionesService.completarEvaluacion(id, calificacionTotal, rubrica, comentarios);
  }

  @Delete('evaluaciones/:id')
  @Roles('COORDINADOR', 'JURADO')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar evaluación' })
  removeEvaluacion(@Param('id') id: string) {
    return this.sustentacionesService.removeEvaluacion(id);
  }
}
