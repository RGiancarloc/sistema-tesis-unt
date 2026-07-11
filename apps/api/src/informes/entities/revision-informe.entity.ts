import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { InformeTesis } from './informe-tesis.entity';
import { Asesor } from '../../usuarios/entities/asesor.entity';

export enum EstadoRevision {
  PENDIENTE = 'PENDIENTE',
  EN_PROGRESO = 'EN_PROGRESO',
  COMPLETADA = 'COMPLETADA',
  APROBADA = 'APROBADA',
  RECHAZADA = 'RECHAZADA',
}

@Entity('revisiones_informe')
export class RevisionInforme {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  informe_id: string;

  @ManyToOne(() => InformeTesis)
  @JoinColumn({ name: 'informe_id' })
  informe: InformeTesis;

  @Column({ type: 'uuid' })
  revisor_id: string;

  @ManyToOne(() => Asesor)
  @JoinColumn({ name: 'revisor_id' })
  revisor: Asesor;

  @Column({ type: 'uuid', nullable: true })
  version_informe_id: string;

  @Column({ type: 'enum', enum: EstadoRevision, default: EstadoRevision.PENDIENTE })
  estado: EstadoRevision;

  @Column({ type: 'text', nullable: true })
  comentarios: string;

  @Column({ type: 'text', nullable: true })
  observaciones: string;

  @Column({ type: 'jsonb', nullable: true })
  correcciones: Record<string, any>;

  @Column({ type: 'boolean', default: false })
  conformidad: boolean;

  @Column({ type: 'timestamp', nullable: true })
  fecha_inicio: Date;

  @Column({ type: 'timestamp', nullable: true })
  fecha_completado: Date;

  @Column({ type: 'text', nullable: true })
  notas: string;

  @Column({ type: 'boolean', default: true })
  activo: boolean;

  @CreateDateColumn({ name: 'creado_en' })
  creado_en: Date;

  @UpdateDateColumn({ name: 'actualizado_en' })
  actualizado_en: Date;
}
