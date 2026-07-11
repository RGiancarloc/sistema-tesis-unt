import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ProyectoTesis } from './proyecto-tesis.entity';
import { Asesor } from '../../usuarios/entities/asesor.entity';

export enum TipoAsesoria {
  PLANIFICACION = 'PLANIFICACION',
  MARCO_TEORICO = 'MARCO_TEORICO',
  METODOLOGIA = 'METODOLOGIA',
  RESULTADOS = 'RESULTADOS',
  REDACCION = 'REDACCION',
  GENERAL = 'GENERAL',
}

export enum EstadoAsesoria {
  PROGRAMADA = 'PROGRAMADA',
  REALIZADA = 'REALIZADA',
  CANCELADA = 'CANCELADA',
  REPROGRAMADA = 'REPROGRAMADA',
}

@Entity('asesorias')
export class Asesoria {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  proyecto_id: string;

  @ManyToOne(() => ProyectoTesis)
  @JoinColumn({ name: 'proyecto_id' })
  proyecto: ProyectoTesis;

  @Column({ type: 'uuid' })
  asesor_id: string;

  @ManyToOne(() => Asesor)
  @JoinColumn({ name: 'asesor_id' })
  asesor: Asesor;

  @Column({ type: 'enum', enum: TipoAsesoria })
  tipo: TipoAsesoria;

  @Column({ type: 'timestamp' })
  fecha_programada: Date;

  @Column({ type: 'timestamp', nullable: true })
  fecha_realizada: Date;

  @Column({ type: 'enum', enum: EstadoAsesoria, default: EstadoAsesoria.PROGRAMADA })
  estado: EstadoAsesoria;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ type: 'text', nullable: true })
  observaciones: string;

  @Column({ type: 'text', nullable: true })
  conclusiones: string;

  @Column({ type: 'integer', nullable: true })
  duracion_minutos: number;

  @Column({ type: 'boolean', default: true })
  activo: boolean;

  @CreateDateColumn({ name: 'creado_en' })
  creado_en: Date;

  @UpdateDateColumn({ name: 'actualizado_en' })
  actualizado_en: Date;
}
