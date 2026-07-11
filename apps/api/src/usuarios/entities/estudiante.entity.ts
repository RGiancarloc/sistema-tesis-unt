import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Usuario } from './usuario.entity';

@Entity('estudiantes')
export class Estudiante {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'usuario_id', unique: true })
  usuario_id: string;

  @ManyToOne(() => Usuario, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @Column({ name: 'codigo_estudiante', unique: true, length: 20 })
  codigo_estudiante: string;

  @Column({ name: 'programa_estudios', length: 150 })
  programa_estudios: string;

  @Column({ length: 150 })
  facultad: string;

  @Column({ name: 'fecha_ingreso', type: 'date' })
  fecha_ingreso: Date;

  @Column({ name: 'fecha_egreso_estimada', type: 'date', nullable: true })
  fecha_egreso_estimada: Date;

  @Column({ name: 'orcid_id', length: 19, nullable: true })
  orcid_id: string;

  @Column({ name: 'datos_academicos', type: 'jsonb', default: '{}' })
  datos_academicos: Record<string, any>;

  @CreateDateColumn({ name: 'creado_en', type: 'timestamp with time zone' })
  creado_en: Date;

  @UpdateDateColumn({ name: 'actualizado_en', type: 'timestamp with time zone' })
  actualizado_en: Date;

  @Column({ name: 'creado_por', nullable: true })
  creado_por: string;

  @Column({ name: 'actualizado_por', nullable: true })
  actualizado_por: string;
}
