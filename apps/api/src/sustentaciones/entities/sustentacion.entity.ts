import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { ProyectoTesis } from '../../proyectos/entities/proyecto-tesis.entity';
import { JuradoSustentacion } from './jurado-sustentacion.entity';
import { EvaluacionSustentacion } from './evaluacion-sustentacion.entity';

export enum EstadoSustentacion {
  PROGRAMADA = 'PROGRAMADA',
  EN_PROGRESO = 'EN_PROGRESO',
  SUSPENDIDA = 'SUSPENDIDA',
  APROBADA = 'APROBADA',
  REPROBADA = 'REPROBADA',
  CANCELADA = 'CANCELADA',
}

export enum ModalidadSustentacion {
  PRESENCIAL = 'PRESENCIAL',
  VIRTUAL = 'VIRTUAL',
  HIBRIDA = 'HIBRIDA',
}

@Entity('sustentaciones')
export class Sustentacion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  proyecto_id: string;

  @ManyToOne(() => ProyectoTesis)
  @JoinColumn({ name: 'proyecto_id' })
  proyecto: ProyectoTesis;

  @Column({ type: 'varchar', length: 255 })
  titulo: string;

  @Column({ type: 'enum', enum: EstadoSustentacion, default: EstadoSustentacion.PROGRAMADA })
  estado: EstadoSustentacion;

  @Column({ type: 'enum', enum: ModalidadSustentacion, default: ModalidadSustentacion.PRESENCIAL })
  modalidad: ModalidadSustentacion;

  @Column({ type: 'timestamp' })
  fecha_programada: Date;

  @Column({ type: 'timestamp', nullable: true })
  fecha_realizada: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  ubicacion: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  enlace_virtual: string;

  @Column({ type: 'integer', nullable: true })
  duracion_minutos: number;

  @Column({ type: 'text', nullable: true })
  observaciones: string;

  @Column({ type: 'text', nullable: true })
  motivo_suspension: string;

  @Column({ type: 'text', nullable: true })
  acta_url: string;

  @Column({ type: 'boolean', default: false })
  acta_generada: boolean;

  @Column({ type: 'jsonb', nullable: true })
  metadatos: Record<string, any>;

  @Column({ type: 'boolean', default: true })
  activo: boolean;

  @CreateDateColumn({ name: 'creado_en' })
  creado_en: Date;

  @UpdateDateColumn({ name: 'actualizado_en' })
  actualizado_en: Date;

  @OneToMany(() => JuradoSustentacion, (jurado) => jurado.sustentacion)
  jurados: JuradoSustentacion[];

  @OneToMany(() => EvaluacionSustentacion, (evaluacion) => evaluacion.sustentacion)
  evaluaciones: EvaluacionSustentacion[];
}
