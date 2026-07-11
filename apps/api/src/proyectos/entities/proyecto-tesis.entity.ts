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
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { Estudiante } from '../../usuarios/entities/estudiante.entity';
import { Asesor } from '../../usuarios/entities/asesor.entity';
import { Asesoria } from './asesoria.entity';
import { HitoProyecto } from './hito-proyecto.entity';

export enum EstadoProyecto {
  BORRADOR = 'BORRADOR',
  ENVIADO_ASESOR = 'ENVIADO_ASESOR',
  APROBADO_ASESOR = 'APROBADO_ASESOR',
  RECHAZADO_ASESOR = 'RECHAZADO_ASESOR',
  ENVIADO_COORDINADOR = 'ENVIADO_COORDINADOR',
  APROBADO_COORDINADOR = 'APROBADO_COORDINADOR',
  RECHAZADO_COORDINADOR = 'RECHAZADO_COORDINADOR',
  EN_DESARROLLO = 'EN_DESARROLLO',
  FINALIZADO = 'FINALIZADO',
  CANCELADO = 'CANCELADO',
}

@Entity('proyectos_tesis')
export class ProyectoTesis {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  estudiante_id: string;

  @ManyToOne(() => Estudiante)
  @JoinColumn({ name: 'estudiante_id' })
  estudiante: Estudiante;

  @Column({ type: 'uuid', nullable: true })
  asesor_id: string;

  @ManyToOne(() => Asesor)
  @JoinColumn({ name: 'asesor_id' })
  asesor: Asesor;

  @Column({ type: 'varchar', length: 255 })
  titulo: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ type: 'text', nullable: true })
  problema_investigacion: string;

  @Column({ type: 'text', nullable: true })
  objetivos: string;

  @Column({ type: 'text', nullable: true })
  justificacion: string;

  @Column({ type: 'text', nullable: true })
  metodologia: string;

  @Column({ type: 'text', array: true, nullable: true })
  palabras_clave: string[];

  @Column({ type: 'enum', enum: EstadoProyecto, default: EstadoProyecto.BORRADOR })
  estado: EstadoProyecto;

  @Column({ type: 'date', nullable: true })
  fecha_envio_asesor: Date;

  @Column({ type: 'date', nullable: true })
  fecha_aprobacion_asesor: Date;

  @Column({ type: 'text', nullable: true })
  comentario_asesor: string;

  @Column({ type: 'date', nullable: true })
  fecha_envio_coordinador: Date;

  @Column({ type: 'date', nullable: true })
  fecha_aprobacion_coordinador: Date;

  @Column({ type: 'text', nullable: true })
  comentario_coordinador: string;

  @Column({ type: 'date', nullable: true })
  fecha_inicio: Date;

  @Column({ type: 'date', nullable: true })
  fecha_fin_estimada: Date;

  @Column({ type: 'date', nullable: true })
  fecha_fin_real: Date;

  @Column({ type: 'jsonb', nullable: true })
  metadatos: Record<string, any>;

  @Column({ type: 'boolean', default: true })
  activo: boolean;

  @CreateDateColumn({ name: 'creado_en' })
  creado_en: Date;

  @UpdateDateColumn({ name: 'actualizado_en' })
  actualizado_en: Date;

  @OneToMany(() => Asesoria, (asesoria) => asesoria.proyecto)
  asesorias: Asesoria[];

  @OneToMany(() => HitoProyecto, (hito) => hito.proyecto)
  hitos: HitoProyecto[];
}
