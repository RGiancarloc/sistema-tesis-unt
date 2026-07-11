import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProyectosService } from './proyectos.service';
import { ProyectosController } from './proyectos.controller';
import { ProyectoTesis } from './entities/proyecto-tesis.entity';
import { Asesoria } from './entities/asesoria.entity';
import { HitoProyecto } from './entities/hito-proyecto.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProyectoTesis,
      Asesoria,
      HitoProyecto,
    ]),
  ],
  controllers: [ProyectosController],
  providers: [ProyectosService],
  exports: [ProyectosService],
})
export class ProyectosModule {}
