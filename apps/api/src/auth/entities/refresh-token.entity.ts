import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity';

@Entity('refresh_tokens')
export class RefreshToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'usuario_id' })
  usuario_id: string;

  @ManyToOne(() => Usuario, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @Column({ type: 'text' })
  token: string;

  @Column({ name: 'expira_en', type: 'timestamp with time zone' })
  expira_en: Date;

  @Column({ default: false })
  revocado: boolean;

  @CreateDateColumn({ name: 'creado_en', type: 'timestamp with time zone' })
  creado_en: Date;
}
