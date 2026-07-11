import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rol } from '../roles/entities/rol.entity';
import { DatabaseService } from './database.service';

@Module({
  imports: [TypeOrmModule.forFeature([Rol])],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
