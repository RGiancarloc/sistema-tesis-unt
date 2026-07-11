import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Sustentacion } from './sustentacion.entity';
import { Jurado } from '../../usuarios/entities/jurado.entity';

export enum EstadoEvaluacion {
  PENDIENTE = 'PENDIENTE',
  EN_PROGRESO = 'EN_PROGRESO',
  COMPLETADA = 'COMPLETADA',
}

@Entity('evaluaciones_sustentacion')
export class EvaluacionSustentacion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  sustentacion_id: string;

  @ManyToOne(() => Sustentacion)
  @JoinColumn({ name: 'sustentacion_id' })
  sustentacion: Sustentacion;

  @Column({ type: 'uuid' })
  jurado_id: string;

  @ManyToOne(() => Jurado)
  @JoinColumn({ name: 'jurado_id' })
  jurado: Jurado;

  @Column({ type: 'enum', enum: EstadoEvaluacion, default: EstadoEvaluacion.PENDIENTE })
  estado: EstadoEvaluacion;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  calificacion_total: number;

  @Column({ type: 'jsonb', nullable: true })
  rubrica_evaluacion: Record<string, any>;

  @Column({ type: 'text', nullable: true })
  comentarios_generales: string;

  @Column({ type: 'text', nullable: true })
  fortalezas: string;

  @Column({ type: 'text', nullable: true })
  debilidades: string;

  @Column({ type: 'text', nullable: true })
  recomendaciones: string;

  @Column({ type: 'boolean', default: false })
  aprobado: boolean;

  @Column({ type: 'timestamp', nullable: true })
  fecha_evaluacion: Date;

  @Column({ type: 'boolean', default: true })
  activo: boolean;

  @CreateDateColumn({ name: 'creado_en' })
  creado_en: Date;

  @UpdateDateColumn({ name: 'actualizado_en' })
  actualizado_en: Date;
}
