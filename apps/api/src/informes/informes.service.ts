import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InformeTesis, EstadoInforme } from './entities/informe-tesis.entity';
import { VersionInforme } from './entities/version-informe.entity';
import { RevisionInforme, EstadoRevision } from './entities/revision-informe.entity';
import { CreateInformeTesisDto } from './dto/create-informe-tesis.dto';
import { UpdateInformeTesisDto } from './dto/update-informe-tesis.dto';
import { CreateVersionInformeDto } from './dto/create-version-informe.dto';
import { UpdateVersionInformeDto } from './dto/update-version-informe.dto';
import { CreateRevisionInformeDto } from './dto/create-revision-informe.dto';
import { UpdateRevisionInformeDto } from './dto/update-revision-informe.dto';

@Injectable()
export class InformesService {
  constructor(
    @InjectRepository(InformeTesis)
    private informesRepository: Repository<InformeTesis>,
    @InjectRepository(VersionInforme)
    private versionesRepository: Repository<VersionInforme>,
    @InjectRepository(RevisionInforme)
    private revisionesRepository: Repository<RevisionInforme>,
  ) {}

  // CRUD Informes de Tesis
  async createInforme(createInformeDto: CreateInformeTesisDto): Promise<InformeTesis> {
    const informe = this.informesRepository.create(createInformeDto);
    return await this.informesRepository.save(informe);
  }

  async findAllInformes(): Promise<InformeTesis[]> {
    return await this.informesRepository.find({
      relations: ['proyecto', 'versiones', 'revisiones'],
      where: { activo: true },
    });
  }

  async findInformeById(id: string): Promise<InformeTesis> {
    const informe = await this.informesRepository.findOne({
      where: { id },
      relations: ['proyecto', 'versiones', 'revisiones', 'revisiones.revisor'],
    });
    if (!informe) {
      throw new NotFoundException(`Informe con ID ${id} no encontrado`);
    }
    return informe;
  }

  async findInformesByProyecto(proyectoId: string): Promise<InformeTesis[]> {
    return await this.informesRepository.find({
      where: { proyecto_id: proyectoId, activo: true },
      relations: ['versiones', 'revisiones'],
      order: { creado_en: 'DESC' },
    });
  }

  async updateInforme(id: string, updateInformeDto: UpdateInformeTesisDto): Promise<InformeTesis> {
    const informe = await this.findInformeById(id);
    Object.assign(informe, updateInformeDto);
    return await this.informesRepository.save(informe);
  }

  async removeInforme(id: string): Promise<void> {
    const informe = await this.findInformeById(id);
    informe.activo = false;
    await this.informesRepository.save(informe);
  }

  // Workflow de Informes
  async enviarRevision(id: string): Promise<InformeTesis> {
    const informe = await this.findInformeById(id);
    if (informe.estado !== EstadoInforme.BORRADOR) {
      throw new BadRequestException('El informe debe estar en estado borrador');
    }
    informe.estado = EstadoInforme.EN_REVISION;
    return await this.informesRepository.save(informe);
  }

  async aprobarInforme(id: string, comentario?: string): Promise<InformeTesis> {
    const informe = await this.findInformeById(id);
    if (informe.estado !== EstadoInforme.EN_REVISION) {
      throw new BadRequestException('El informe no está en revisión');
    }
    informe.estado = EstadoInforme.APROBADO;
    informe.fecha_aprobacion = new Date();
    informe.comentario_asesor = comentario;
    return await this.informesRepository.save(informe);
  }

  async rechazarInforme(id: string, comentario: string): Promise<InformeTesis> {
    const informe = await this.findInformeById(id);
    if (informe.estado !== EstadoInforme.EN_REVISION) {
      throw new BadRequestException('El informe no está en revisión');
    }
    informe.estado = EstadoInforme.RECHAZADO;
    informe.comentario_asesor = comentario;
    return await this.informesRepository.save(informe);
  }

  async finalizarInforme(id: string): Promise<InformeTesis> {
    const informe = await this.findInformeById(id);
    if (informe.estado !== EstadoInforme.APROBADO) {
      throw new BadRequestException('El informe debe estar aprobado');
    }
    informe.estado = EstadoInforme.FINALIZADO;
    informe.fecha_entrega = new Date();
    return await this.informesRepository.save(informe);
  }

  // CRUD Versiones de Informe
  async createVersion(createVersionDto: CreateVersionInformeDto): Promise<VersionInforme> {
    const version = this.versionesRepository.create(createVersionDto);
    return await this.versionesRepository.save(version);
  }

  async findVersionsByInforme(informeId: string): Promise<VersionInforme[]> {
    return await this.versionesRepository.find({
      where: { informe_id: informeId, activo: true },
      order: { numero_version: 'DESC' },
    });
  }

  async findLatestVersion(informeId: string): Promise<VersionInforme> {
    const versions = await this.findVersionsByInforme(informeId);
    return versions[0];
  }

  async updateVersion(id: string, updateVersionDto: UpdateVersionInformeDto): Promise<VersionInforme> {
    const version = await this.versionesRepository.findOne({ where: { id } });
    if (!version) {
      throw new NotFoundException(`Versión con ID ${id} no encontrada`);
    }
    Object.assign(version, updateVersionDto);
    return await this.versionesRepository.save(version);
  }

  async removeVersion(id: string): Promise<void> {
    const version = await this.versionesRepository.findOne({ where: { id } });
    if (!version) {
      throw new NotFoundException(`Versión con ID ${id} no encontrada`);
    }
    version.activo = false;
    await this.versionesRepository.save(version);
  }

  // CRUD Revisiones de Informe
  async createRevision(createRevisionDto: CreateRevisionInformeDto): Promise<RevisionInforme> {
    const revision = this.revisionesRepository.create({
      ...createRevisionDto,
      fecha_inicio: new Date(),
    });
    return await this.revisionesRepository.save(revision);
  }

  async findRevisionsByInforme(informeId: string): Promise<RevisionInforme[]> {
    return await this.revisionesRepository.find({
      where: { informe_id: informeId, activo: true },
      relations: ['revisor'],
      order: { creado_en: 'DESC' },
    });
  }

  async findRevisionsByRevisor(revisorId: string): Promise<RevisionInforme[]> {
    return await this.revisionesRepository.find({
      where: { revisor_id: revisorId, activo: true },
      relations: ['informe', 'informe.proyecto'],
      order: { creado_en: 'DESC' },
    });
  }

  async updateRevision(id: string, updateRevisionDto: UpdateRevisionInformeDto): Promise<RevisionInforme> {
    const revision = await this.revisionesRepository.findOne({ where: { id } });
    if (!revision) {
      throw new NotFoundException(`Revisión con ID ${id} no encontrada`);
    }
    Object.assign(revision, updateRevisionDto);
    return await this.revisionesRepository.save(revision);
  }

  async iniciarRevision(id: string): Promise<RevisionInforme> {
    const revision = await this.revisionesRepository.findOne({ where: { id } });
    if (!revision) {
      throw new NotFoundException(`Revisión con ID ${id} no encontrada`);
    }
    revision.estado = EstadoRevision.EN_PROGRESO;
    revision.fecha_inicio = new Date();
    return await this.revisionesRepository.save(revision);
  }

  async completarRevision(id: string, comentarios: string, conformidad: boolean): Promise<RevisionInforme> {
    const revision = await this.revisionesRepository.findOne({ where: { id } });
    if (!revision) {
      throw new NotFoundException(`Revisión con ID ${id} no encontrada`);
    }
    revision.estado = EstadoRevision.COMPLETADA;
    revision.fecha_completado = new Date();
    revision.comentarios = comentarios;
    revision.conformidad = conformidad;
    return await this.revisionesRepository.save(revision);
  }

  async aprobarRevision(id: string): Promise<RevisionInforme> {
    const revision = await this.revisionesRepository.findOne({ where: { id } });
    if (!revision) {
      throw new NotFoundException(`Revisión con ID ${id} no encontrada`);
    }
    revision.estado = EstadoRevision.APROBADA;
    return await this.revisionesRepository.save(revision);
  }

  async rechazarRevision(id: string, motivo: string): Promise<RevisionInforme> {
    const revision = await this.revisionesRepository.findOne({ where: { id } });
    if (!revision) {
      throw new NotFoundException(`Revisión con ID ${id} no encontrada`);
    }
    revision.estado = EstadoRevision.RECHAZADA;
    revision.observaciones = motivo;
    return await this.revisionesRepository.save(revision);
  }

  async removeRevision(id: string): Promise<void> {
    const revision = await this.revisionesRepository.findOne({ where: { id } });
    if (!revision) {
      throw new NotFoundException(`Revisión con ID ${id} no encontrada`);
    }
    revision.activo = false;
    await this.revisionesRepository.save(revision);
  }
}
