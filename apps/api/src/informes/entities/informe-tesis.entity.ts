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
import { VersionInforme } from './version-informe.entity';
import { RevisionInforme } from './revision-informe.entity';

export enum EstadoInforme {
  BORRADOR = 'BORRADOR',
  EN_REVISION = 'EN_REVISION',
  APROBADO = 'APROBADO',
  RECHAZADO = 'RECHAZADO',
  FINALIZADO = 'FINALIZADO',
  ENTREGADO = 'ENTREGADO',
}

@Entity('informes_tesis')
export class InformeTesis {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  proyecto_id: string;

  @ManyToOne(() => ProyectoTesis)
  @JoinColumn({ name: 'proyecto_id' })
  proyecto: ProyectoTesis;

  @Column({ type: 'varchar', length: 255 })
  titulo: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ type: 'enum', enum: EstadoInforme, default: EstadoInforme.BORRADOR })
  estado: EstadoInforme;

  @Column({ type: 'integer', default: 0 })
  numero_version: number;

  @Column({ type: 'date', nullable: true })
  fecha_inicio: Date;

  @Column({ type: 'date', nullable: true })
  fecha_limite: Date;

  @Column({ type: 'date', nullable: true })
  fecha_entrega: Date;

  @Column({ type: 'date', nullable: true })
  fecha_aprobacion: Date;

  @Column({ type: 'text', nullable: true })
  comentario_asesor: string;

  @Column({ type: 'text', nullable: true })
  comentario_coordinador: string;

  @Column({ type: 'jsonb', nullable: true })
  metadatos: Record<string, any>;

  @Column({ type: 'boolean', default: true })
  activo: boolean;

  @CreateDateColumn({ name: 'creado_en' })
  creado_en: Date;

  @UpdateDateColumn({ name: 'actualizado_en' })
  actualizado_en: Date;

  @OneToMany(() => VersionInforme, (version) => version.informe)
  versiones: VersionInforme[];

  @OneToMany(() => RevisionInforme, (revision) => revision.informe)
  revisiones: RevisionInforme[];
}
