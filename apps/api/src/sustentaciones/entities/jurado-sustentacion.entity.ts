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

export enum RolJurado {
  PRESIDENTE = 'PRESIDENTE',
  MIEMBRO = 'MIEMBRO',
  SECRETARIO = 'SECRETARIO',
}

export enum EstadoJurado {
  ASIGNADO = 'ASIGNADO',
  ACEPTADO = 'ACEPTADO',
  RECHAZADO = 'RECHAZADO',
  SUSTITUIDO = 'SUSTITUIDO',
}

@Entity('jurados_sustentacion')
export class JuradoSustentacion {
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

  @Column({ type: 'enum', enum: RolJurado })
  rol: RolJurado;

  @Column({ type: 'enum', enum: EstadoJurado, default: EstadoJurado.ASIGNADO })
  estado: EstadoJurado;

  @Column({ type: 'text', nullable: true })
  observaciones: string;

  @Column({ type: 'timestamp', nullable: true })
  fecha_asignacion: Date;

  @Column({ type: 'timestamp', nullable: true })
  fecha_aceptacion: Date;

  @Column({ type: 'boolean', default: true })
  activo: boolean;

  @CreateDateColumn({ name: 'creado_en' })
  creado_en: Date;

  @UpdateDateColumn({ name: 'actualizado_en' })
  actualizado_en: Date;
}
