import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sustentacion, EstadoSustentacion } from './entities/sustentacion.entity';
import { JuradoSustentacion, EstadoJurado } from './entities/jurado-sustentacion.entity';
import { EvaluacionSustentacion, EstadoEvaluacion } from './entities/evaluacion-sustentacion.entity';
import { CreateSustentacionDto } from './dto/create-sustentacion.dto';
import { UpdateSustentacionDto } from './dto/update-sustentacion.dto';
import { CreateJuradoSustentacionDto } from './dto/create-jurado-sustentacion.dto';
import { UpdateJuradoSustentacionDto } from './dto/update-jurado-sustentacion.dto';
import { CreateEvaluacionSustentacionDto } from './dto/create-evaluacion-sustentacion.dto';
import { UpdateEvaluacionSustentacionDto } from './dto/update-evaluacion-sustentacion.dto';

@Injectable()
export class SustentacionesService {
  constructor(
    @InjectRepository(Sustentacion)
    private sustentacionesRepository: Repository<Sustentacion>,
    @InjectRepository(JuradoSustentacion)
    private juradosRepository: Repository<JuradoSustentacion>,
    @InjectRepository(EvaluacionSustentacion)
    private evaluacionesRepository: Repository<EvaluacionSustentacion>,
  ) {}

  // CRUD Sustentaciones
  async createSustentacion(createSustentacionDto: CreateSustentacionDto): Promise<Sustentacion> {
    const sustentacion = this.sustentacionesRepository.create(createSustentacionDto);
    return await this.sustentacionesRepository.save(sustentacion);
  }

  async findAllSustentaciones(): Promise<Sustentacion[]> {
    return await this.sustentacionesRepository.find({
      relations: ['proyecto', 'jurados', 'jurados.jurado', 'evaluaciones'],
      where: { activo: true },
      order: { fecha_programada: 'DESC' },
    });
  }

  async findSustentacionById(id: string): Promise<Sustentacion> {
    const sustentacion = await this.sustentacionesRepository.findOne({
      where: { id },
      relations: ['proyecto', 'jurados', 'jurados.jurado', 'evaluaciones', 'evaluaciones.jurado'],
    });
    if (!sustentacion) {
      throw new NotFoundException(`Sustentación con ID ${id} no encontrada`);
    }
    return sustentacion;
  }

  async findSustentacionesByProyecto(proyectoId: string): Promise<Sustentacion[]> {
    return await this.sustentacionesRepository.find({
      where: { proyecto_id: proyectoId, activo: true },
      relations: ['jurados', 'evaluaciones'],
      order: { fecha_programada: 'DESC' },
    });
  }

  async updateSustentacion(id: string, updateSustentacionDto: UpdateSustentacionDto): Promise<Sustentacion> {
    const sustentacion = await this.findSustentacionById(id);
    Object.assign(sustentacion, updateSustentacionDto);
    return await this.sustentacionesRepository.save(sustentacion);
  }

  async removeSustentacion(id: string): Promise<void> {
    const sustentacion = await this.findSustentacionById(id);
    sustentacion.activo = false;
    await this.sustentacionesRepository.save(sustentacion);
  }

  // Workflow de Sustentaciones
  async iniciarSustentacion(id: string): Promise<Sustentacion> {
    const sustentacion = await this.findSustentacionById(id);
    if (sustentacion.estado !== EstadoSustentacion.PROGRAMADA) {
      throw new BadRequestException('La sustentación debe estar programada');
    }
    sustentacion.estado = EstadoSustentacion.EN_PROGRESO;
    sustentacion.fecha_realizada = new Date();
    return await this.sustentacionesRepository.save(sustentacion);
  }

  async suspenderSustentacion(id: string, motivo: string): Promise<Sustentacion> {
    const sustentacion = await this.findSustentacionById(id);
    if (sustentacion.estado !== EstadoSustentacion.EN_PROGRESO) {
      throw new BadRequestException('La sustentación debe estar en progreso');
    }
    sustentacion.estado = EstadoSustentacion.SUSPENDIDA;
    sustentacion.motivo_suspension = motivo;
    return await this.sustentacionesRepository.save(sustentacion);
  }

  async aprobarSustentacion(id: string): Promise<Sustentacion> {
    const sustentacion = await this.findSustentacionById(id);
    if (sustentacion.estado !== EstadoSustentacion.EN_PROGRESO) {
      throw new BadRequestException('La sustentación debe estar en progreso');
    }
    sustentacion.estado = EstadoSustentacion.APROBADA;
    return await this.sustentacionesRepository.save(sustentacion);
  }

  async reprobarSustentacion(id: string): Promise<Sustentacion> {
    const sustentacion = await this.findSustentacionById(id);
    if (sustentacion.estado !== EstadoSustentacion.EN_PROGRESO) {
      throw new BadRequestException('La sustentación debe estar en progreso');
    }
    sustentacion.estado = EstadoSustentacion.REPROBADA;
    return await this.sustentacionesRepository.save(sustentacion);
  }

  async generarActa(id: string, actaUrl: string): Promise<Sustentacion> {
    const sustentacion = await this.findSustentacionById(id);
    sustentacion.acta_url = actaUrl;
    sustentacion.acta_generada = true;
    return await this.sustentacionesRepository.save(sustentacion);
  }

  // CRUD Jurados de Sustentación
  async createJuradoSustentacion(createJuradoDto: CreateJuradoSustentacionDto): Promise<JuradoSustentacion> {
    const juradoSustentacion = this.juradosRepository.create({
      ...createJuradoDto,
      fecha_asignacion: new Date(),
    });
    return await this.juradosRepository.save(juradoSustentacion);
  }

  async findJuradosBySustentacion(sustentacionId: string): Promise<JuradoSustentacion[]> {
    return await this.juradosRepository.find({
      where: { sustentacion_id: sustentacionId, activo: true },
      relations: ['jurado'],
      order: { creado_en: 'ASC' },
    });
  }

  async findJuradosByJurado(juradoId: string): Promise<JuradoSustentacion[]> {
    return await this.juradosRepository.find({
      where: { jurado_id: juradoId, activo: true },
      relations: ['sustentacion', 'sustentacion.proyecto'],
      order: { creado_en: 'DESC' },
    });
  }

  async updateJuradoSustentacion(id: string, updateJuradoDto: UpdateJuradoSustentacionDto): Promise<JuradoSustentacion> {
    const juradoSustentacion = await this.juradosRepository.findOne({ where: { id } });
    if (!juradoSustentacion) {
      throw new NotFoundException(`Jurado de sustentación con ID ${id} no encontrado`);
    }
    Object.assign(juradoSustentacion, updateJuradoDto);
    return await this.juradosRepository.save(juradoSustentacion);
  }

  async aceptarJurado(id: string): Promise<JuradoSustentacion> {
    const juradoSustentacion = await this.juradosRepository.findOne({ where: { id } });
    if (!juradoSustentacion) {
      throw new NotFoundException(`Jurado de sustentación con ID ${id} no encontrado`);
    }
    juradoSustentacion.estado = EstadoJurado.ACEPTADO;
    juradoSustentacion.fecha_aceptacion = new Date();
    return await this.juradosRepository.save(juradoSustentacion);
  }

  async rechazarJurado(id: string, motivo: string): Promise<JuradoSustentacion> {
    const juradoSustentacion = await this.juradosRepository.findOne({ where: { id } });
    if (!juradoSustentacion) {
      throw new NotFoundException(`Jurado de sustentación con ID ${id} no encontrado`);
    }
    juradoSustentacion.estado = EstadoJurado.RECHAZADO;
    juradoSustentacion.observaciones = motivo;
    return await this.juradosRepository.save(juradoSustentacion);
  }

  async removeJuradoSustentacion(id: string): Promise<void> {
    const juradoSustentacion = await this.juradosRepository.findOne({ where: { id } });
    if (!juradoSustentacion) {
      throw new NotFoundException(`Jurado de sustentación con ID ${id} no encontrado`);
    }
    juradoSustentacion.activo = false;
    await this.juradosRepository.save(juradoSustentacion);
  }

  // CRUD Evaluaciones de Sustentación
  async createEvaluacion(createEvaluacionDto: CreateEvaluacionSustentacionDto): Promise<EvaluacionSustentacion> {
    const evaluacion = this.evaluacionesRepository.create(createEvaluacionDto);
    return await this.evaluacionesRepository.save(evaluacion);
  }

  async findEvaluacionesBySustentacion(sustentacionId: string): Promise<EvaluacionSustentacion[]> {
    return await this.evaluacionesRepository.find({
      where: { sustentacion_id: sustentacionId, activo: true },
      relations: ['jurado'],
      order: { creado_en: 'ASC' },
    });
  }

  async findEvaluacionesByJurado(juradoId: string): Promise<EvaluacionSustentacion[]> {
    return await this.evaluacionesRepository.find({
      where: { jurado_id: juradoId, activo: true },
      relations: ['sustentacion', 'sustentacion.proyecto'],
      order: { creado_en: 'DESC' },
    });
  }

  async updateEvaluacion(id: string, updateEvaluacionDto: UpdateEvaluacionSustentacionDto): Promise<EvaluacionSustentacion> {
    const evaluacion = await this.evaluacionesRepository.findOne({ where: { id } });
    if (!evaluacion) {
      throw new NotFoundException(`Evaluación con ID ${id} no encontrada`);
    }
    Object.assign(evaluacion, updateEvaluacionDto);
    return await this.evaluacionesRepository.save(evaluacion);
  }

  async iniciarEvaluacion(id: string): Promise<EvaluacionSustentacion> {
    const evaluacion = await this.evaluacionesRepository.findOne({ where: { id } });
    if (!evaluacion) {
      throw new NotFoundException(`Evaluación con ID ${id} no encontrada`);
    }
    evaluacion.estado = EstadoEvaluacion.EN_PROGRESO;
    return await this.evaluacionesRepository.save(evaluacion);
  }

  async completarEvaluacion(id: string, calificacionTotal: number, rubrica: Record<string, any>, comentarios: string): Promise<EvaluacionSustentacion> {
    const evaluacion = await this.evaluacionesRepository.findOne({ where: { id } });
    if (!evaluacion) {
      throw new NotFoundException(`Evaluación con ID ${id} no encontrada`);
    }
    evaluacion.estado = EstadoEvaluacion.COMPLETADA;
    evaluacion.calificacion_total = calificacionTotal;
    evaluacion.rubrica_evaluacion = rubrica;
    evaluacion.comentarios_generales = comentarios;
    evaluacion.fecha_evaluacion = new Date();
    return await this.evaluacionesRepository.save(evaluacion);
  }

  async removeEvaluacion(id: string): Promise<void> {
    const evaluacion = await this.evaluacionesRepository.findOne({ where: { id } });
    if (!evaluacion) {
      throw new NotFoundException(`Evaluación con ID ${id} no encontrada`);
    }
    evaluacion.activo = false;
    await this.evaluacionesRepository.save(evaluacion);
  }
}
