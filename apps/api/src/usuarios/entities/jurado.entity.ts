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

@Entity('jurados')
export class Jurado {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'usuario_id', unique: true })
  usuario_id: string;

  @ManyToOne(() => Usuario, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @Column({ name: 'codigo_docente', unique: true, length: 20 })
  codigo_docente: string;

  @Column({ length: 200 })
  especialidad: string;

  @Column({ name: 'es_doctor', default: false })
  es_doctor: boolean;

  @Column({ name: 'sustentaciones_participadas', default: 0 })
  sustentaciones_participadas: number;

  @Column({ name: 'datos_jurado', type: 'jsonb', default: '{}' })
  datos_jurado: Record<string, any>;

  @CreateDateColumn({ name: 'creado_en', type: 'timestamp with time zone' })
  creado_en: Date;

  @UpdateDateColumn({ name: 'actualizado_en', type: 'timestamp with time zone' })
  actualizado_en: Date;

  @Column({ name: 'creado_por', nullable: true })
  creado_por: string;

  @Column({ name: 'actualizado_por', nullable: true })
  actualizado_por: string;
}
