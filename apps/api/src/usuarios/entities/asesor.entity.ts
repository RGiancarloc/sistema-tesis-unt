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

@Entity('asesores')
export class Asesor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'usuario_id', unique: true })
  usuario_id: string;

  @ManyToOne(() => Usuario, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @Column({ name: 'codigo_docente', unique: true, length: 20 })
  codigo_docente: string;

  @Column({ length: 50, nullable: true })
  categoria: string;

  @Column({ length: 150, nullable: true })
  departamento: string;

  @Column({ name: 'area_investigacion', length: 200 })
  area_investigacion: string;

  @Column({ name: 'carga_academica_actual', default: 0 })
  carga_academica_actual: number;

  @Column({ name: 'tesis_dirigidas', default: 0 })
  tesis_dirigidas: number;

  @Column({ name: 'orcid_id', length: 19, nullable: true })
  orcid_id: string;

  @Column({ name: 'datos_investigacion', type: 'jsonb', default: '{}' })
  datos_investigacion: Record<string, any>;

  @CreateDateColumn({ name: 'creado_en', type: 'timestamp with time zone' })
  creado_en: Date;

  @UpdateDateColumn({ name: 'actualizado_en', type: 'timestamp with time zone' })
  actualizado_en: Date;

  @Column({ name: 'creado_por', nullable: true })
  creado_por: string;

  @Column({ name: 'actualizado_por', nullable: true })
  actualizado_por: string;
}
