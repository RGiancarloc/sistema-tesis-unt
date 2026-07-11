import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProyectoTesis, EstadoProyecto } from './entities/proyecto-tesis.entity';
import { Asesoria, EstadoAsesoria } from './entities/asesoria.entity';
import { HitoProyecto, EstadoHito } from './entities/hito-proyecto.entity';
import { CreateProyectoTesisDto } from './dto/create-proyecto-tesis.dto';
import { UpdateProyectoTesisDto } from './dto/update-proyecto-tesis.dto';
import { CreateAsesoriaDto } from './dto/create-asesoria.dto';
import { UpdateAsesoriaDto } from './dto/update-asesoria.dto';
import { CreateHitoProyectoDto } from './dto/create-hito-proyecto.dto';
import { UpdateHitoProyectoDto } from './dto/update-hito-proyecto.dto';

@Injectable()
export class ProyectosService {
  constructor(
    @InjectRepository(ProyectoTesis)
    private proyectosRepository: Repository<ProyectoTesis>,
    @InjectRepository(Asesoria)
    private asesoriasRepository: Repository<Asesoria>,
    @InjectRepository(HitoProyecto)
    private hitosRepository: Repository<HitoProyecto>,
  ) {}

  // CRUD Proyectos de Tesis
  async createProyecto(createProyectoDto: CreateProyectoTesisDto): Promise<ProyectoTesis> {
    const proyecto = this.proyectosRepository.create(createProyectoDto);
    return await this.proyectosRepository.save(proyecto);
  }

  async findAllProyectos(): Promise<ProyectoTesis[]> {
    return await this.proyectosRepository.find({
      relations: ['estudiante', 'asesor', 'asesorias', 'hitos'],
      where: { activo: true },
    });
  }

  async findProyectoById(id: string): Promise<ProyectoTesis> {
    const proyecto = await this.proyectosRepository.findOne({
      where: { id },
      relations: ['estudiante', 'asesor', 'asesorias', 'hitos'],
    });
    if (!proyecto) {
      throw new NotFoundException(`Proyecto con ID ${id} no encontrado`);
    }
    return proyecto;
  }

  async findProyectosByEstudiante(estudianteId: string): Promise<ProyectoTesis[]> {
    return await this.proyectosRepository.find({
      where: { estudiante_id: estudianteId, activo: true },
      relations: ['asesor', 'asesorias', 'hitos'],
    });
  }

  async findProyectosByAsesor(asesorId: string): Promise<ProyectoTesis[]> {
    return await this.proyectosRepository.find({
      where: { asesor_id: asesorId, activo: true },
      relations: ['estudiante', 'asesorias', 'hitos'],
    });
  }

  async updateProyecto(id: string, updateProyectoDto: UpdateProyectoTesisDto): Promise<ProyectoTesis> {
    const proyecto = await this.findProyectoById(id);
    Object.assign(proyecto, updateProyectoDto);
    return await this.proyectosRepository.save(proyecto);
  }

  async removeProyecto(id: string): Promise<void> {
    const proyecto = await this.findProyectoById(id);
    proyecto.activo = false;
    await this.proyectosRepository.save(proyecto);
  }

  // Workflow de Aprobación
  async enviarAAesor(id: string): Promise<ProyectoTesis> {
    const proyecto = await this.findProyectoById(id);
    if (!proyecto.asesor_id) {
      throw new BadRequestException('El proyecto debe tener un asesor asignado');
    }
    proyecto.estado = EstadoProyecto.ENVIADO_ASESOR;
    proyecto.fecha_envio_asesor = new Date();
    return await this.proyectosRepository.save(proyecto);
  }

  async aprobarPorAsesor(id: string, comentario?: string): Promise<ProyectoTesis> {
    const proyecto = await this.findProyectoById(id);
    if (proyecto.estado !== EstadoProyecto.ENVIADO_ASESOR) {
      throw new BadRequestException('El proyecto no está en estado para aprobación por asesor');
    }
    proyecto.estado = EstadoProyecto.APROBADO_ASESOR;
    proyecto.fecha_aprobacion_asesor = new Date();
    proyecto.comentario_asesor = comentario;
    return await this.proyectosRepository.save(proyecto);
  }

  async rechazarPorAsesor(id: string, comentario: string): Promise<ProyectoTesis> {
    const proyecto = await this.findProyectoById(id);
    if (proyecto.estado !== EstadoProyecto.ENVIADO_ASESOR) {
      throw new BadRequestException('El proyecto no está en estado para revisión por asesor');
    }
    proyecto.estado = EstadoProyecto.RECHAZADO_ASESOR;
    proyecto.comentario_asesor = comentario;
    return await this.proyectosRepository.save(proyecto);
  }

  async enviarACoordinador(id: string): Promise<ProyectoTesis> {
    const proyecto = await this.findProyectoById(id);
    if (proyecto.estado !== EstadoProyecto.APROBADO_ASESOR) {
      throw new BadRequestException('El proyecto debe estar aprobado por el asesor');
    }
    proyecto.estado = EstadoProyecto.ENVIADO_COORDINADOR;
    proyecto.fecha_envio_coordinador = new Date();
    return await this.proyectosRepository.save(proyecto);
  }

  async aprobarPorCoordinador(id: string, comentario?: string): Promise<ProyectoTesis> {
    const proyecto = await this.findProyectoById(id);
    if (proyecto.estado !== EstadoProyecto.ENVIADO_COORDINADOR) {
      throw new BadRequestException('El proyecto no está en estado para aprobación por coordinador');
    }
    proyecto.estado = EstadoProyecto.EN_DESARROLLO;
    proyecto.fecha_aprobacion_coordinador = new Date();
    proyecto.comentario_coordinador = comentario;
    proyecto.fecha_inicio = new Date();
    return await this.proyectosRepository.save(proyecto);
  }

  async rechazarPorCoordinador(id: string, comentario: string): Promise<ProyectoTesis> {
    const proyecto = await this.findProyectoById(id);
    if (proyecto.estado !== EstadoProyecto.ENVIADO_COORDINADOR) {
      throw new BadRequestException('El proyecto no está en estado para revisión por coordinador');
    }
    proyecto.estado = EstadoProyecto.RECHAZADO_COORDINADOR;
    proyecto.comentario_coordinador = comentario;
    return await this.proyectosRepository.save(proyecto);
  }

  async asignarAsesor(proyectoId: string, asesorId: string): Promise<ProyectoTesis> {
    const proyecto = await this.findProyectoById(proyectoId);
    proyecto.asesor_id = asesorId;
    return await this.proyectosRepository.save(proyecto);
  }

  // CRUD Asesorías
  async createAsesoria(createAsesoriaDto: CreateAsesoriaDto): Promise<Asesoria> {
    const asesoria = this.asesoriasRepository.create(createAsesoriaDto);
    return await this.asesoriasRepository.save(asesoria);
  }

  async findAllAsesorias(): Promise<Asesoria[]> {
    return await this.asesoriasRepository.find({
      relations: ['proyecto', 'asesor'],
      where: { activo: true },
    });
  }

  async findAsesoriasByProyecto(proyectoId: string): Promise<Asesoria[]> {
    return await this.asesoriasRepository.find({
      where: { proyecto_id: proyectoId, activo: true },
      relations: ['asesor'],
      order: { fecha_programada: 'DESC' },
    });
  }

  async findAsesoriasByAsesor(asesorId: string): Promise<Asesoria[]> {
    return await this.asesoriasRepository.find({
      where: { asesor_id: asesorId, activo: true },
      relations: ['proyecto'],
      order: { fecha_programada: 'DESC' },
    });
  }

  async updateAsesoria(id: string, updateAsesoriaDto: UpdateAsesoriaDto): Promise<Asesoria> {
    const asesoria = await this.asesoriasRepository.findOne({ where: { id } });
    if (!asesoria) {
      throw new NotFoundException(`Asesoría con ID ${id} no encontrada`);
    }
    Object.assign(asesoria, updateAsesoriaDto);
    return await this.asesoriasRepository.save(asesoria);
  }

  async completarAsesoria(id: string, conclusiones: string): Promise<Asesoria> {
    const asesoria = await this.asesoriasRepository.findOne({ where: { id } });
    if (!asesoria) {
      throw new NotFoundException(`Asesoría con ID ${id} no encontrada`);
    }
    asesoria.estado = EstadoAsesoria.REALIZADA;
    asesoria.fecha_realizada = new Date();
    asesoria.conclusiones = conclusiones;
    return await this.asesoriasRepository.save(asesoria);
  }

  async removeAsesoria(id: string): Promise<void> {
    const asesoria = await this.asesoriasRepository.findOne({ where: { id } });
    if (!asesoria) {
      throw new NotFoundException(`Asesoría con ID ${id} no encontrada`);
    }
    asesoria.activo = false;
    await this.asesoriasRepository.save(asesoria);
  }

  // CRUD Hitos
  async createHito(createHitoDto: CreateHitoProyectoDto): Promise<HitoProyecto> {
    const hito = this.hitosRepository.create(createHitoDto);
    return await this.hitosRepository.save(hito);
  }

  async findAllHitosByProyecto(proyectoId: string): Promise<HitoProyecto[]> {
    return await this.hitosRepository.find({
      where: { proyecto_id: proyectoId, activo: true },
      order: { orden: 'ASC' },
    });
  }

  async updateHito(id: string, updateHitoDto: UpdateHitoProyectoDto): Promise<HitoProyecto> {
    const hito = await this.hitosRepository.findOne({ where: { id } });
    if (!hito) {
      throw new NotFoundException(`Hito con ID ${id} no encontrado`);
    }
    Object.assign(hito, updateHitoDto);
    return await this.hitosRepository.save(hito);
  }

  async completarHito(id: string): Promise<HitoProyecto> {
    const hito = await this.hitosRepository.findOne({ where: { id } });
    if (!hito) {
      throw new NotFoundException(`Hito con ID ${id} no encontrado`);
    }
    hito.estado = EstadoHito.COMPLETADO;
    hito.fecha_completado = new Date();
    return await this.hitosRepository.save(hito);
  }

  async removeHito(id: string): Promise<void> {
    const hito = await this.hitosRepository.findOne({ where: { id } });
    if (!hito) {
      throw new NotFoundException(`Hito con ID ${id} no encontrado`);
    }
    hito.activo = false;
    await this.hitosRepository.save(hito);
  }
}
