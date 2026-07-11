import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Rol } from '../../roles/entities/rol.entity';
import { Estudiante } from './estudiante.entity';
import { Asesor } from './asesor.entity';
import { Jurado } from './jurado.entity';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'rol_id', nullable: true })
  rol_id: string;

  @ManyToOne(() => Rol, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'rol_id' })
  rol: Rol;

  @Column({ name: 'correo_institucional', unique: true, length: 255 })
  correo_institucional: string;

  @Column({ name: 'contrasena_hash', length: 255 })
  contrasena_hash: string;

  @Column({ length: 100 })
  nombres: string;

  @Column({ name: 'apellido_paterno', length: 100 })
  apellido_paterno: string;

  @Column({ name: 'apellido_materno', length: 100, nullable: true })
  apellido_materno: string;

  @Column({ length: 8, nullable: true, unique: true })
  dni: string;

  @Column({ length: 20, nullable: true })
  telefono: string;

  @Column({ default: true })
  activo: boolean;

  @Column({ name: 'ultimo_acceso', type: 'timestamp with time zone', nullable: true })
  ultimo_acceso: Date;

  @CreateDateColumn({ name: 'creado_en', type: 'timestamp with time zone' })
  creado_en: Date;

  @UpdateDateColumn({ name: 'actualizado_en', type: 'timestamp with time zone' })
  actualizado_en: Date;

  @Column({ name: 'creado_por', nullable: true })
  creado_por: string;

  @Column({ name: 'actualizado_por', nullable: true })
  actualizado_por: string;

  @OneToMany(() => Estudiante, (estudiante) => estudiante.usuario)
  estudiantes: Estudiante[];

  @OneToMany(() => Asesor, (asesor) => asesor.usuario)
  asesores: Asesor[];

  @OneToMany(() => Jurado, (jurado) => jurado.usuario)
  jurados: Jurado[];
}
