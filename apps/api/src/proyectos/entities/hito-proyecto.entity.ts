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

export enum EstadoHito {
  PENDIENTE = 'PENDIENTE',
  EN_PROGRESO = 'EN_PROGRESO',
  COMPLETADO = 'COMPLETADO',
  ATRASADO = 'ATRASADO',
}

@Entity('hitos_proyecto')
export class HitoProyecto {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  proyecto_id: string;

  @ManyToOne(() => ProyectoTesis)
  @JoinColumn({ name: 'proyecto_id' })
  proyecto: ProyectoTesis;

  @Column({ type: 'varchar', length: 255 })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ type: 'enum', enum: EstadoHito, default: EstadoHito.PENDIENTE })
  estado: EstadoHito;

  @Column({ type: 'date', nullable: true })
  fecha_limite: Date;

  @Column({ type: 'date', nullable: true })
  fecha_completado: Date;

  @Column({ type: 'integer', default: 0 })
  orden: number;

  @Column({ type: 'text', nullable: true })
  observaciones: string;

  @Column({ type: 'boolean', default: true })
  activo: boolean;

  @CreateDateColumn({ name: 'creado_en' })
  creado_en: Date;

  @UpdateDateColumn({ name: 'actualizado_en' })
  actualizado_en: Date;
}
