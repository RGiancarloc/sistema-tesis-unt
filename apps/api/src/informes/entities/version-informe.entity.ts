import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { InformeTesis } from './informe-tesis.entity';

export enum TipoArchivo {
  PDF = 'PDF',
  DOCX = 'DOCX',
  DOC = 'DOC',
  OTRO = 'OTRO',
}

@Entity('versiones_informe')
export class VersionInforme {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  informe_id: string;

  @ManyToOne(() => InformeTesis)
  @JoinColumn({ name: 'informe_id' })
  informe: InformeTesis;

  @Column({ type: 'integer' })
  numero_version: number;

  @Column({ type: 'varchar', length: 255 })
  nombre_archivo: string;

  @Column({ type: 'varchar', length: 500 })
  ruta_archivo: string;

  @Column({ type: 'varchar', length: 500 })
  url_archivo: string;

  @Column({ type: 'bigint' })
  tamano_bytes: number;

  @Column({ type: 'enum', enum: TipoArchivo })
  tipo_archivo: TipoArchivo;

  @Column({ type: 'text', nullable: true })
  hash_archivo: string;

  @Column({ type: 'text', nullable: true })
  notas_version: string;

  @Column({ type: 'boolean', default: true })
  activo: boolean;

  @CreateDateColumn({ name: 'creado_en' })
  creado_en: Date;

  @UpdateDateColumn({ name: 'actualizado_en' })
  actualizado_en: Date;
}
