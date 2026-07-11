import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SustentacionesService } from './sustentaciones.service';
import { SustentacionesController } from './sustentaciones.controller';
import { Sustentacion } from './entities/sustentacion.entity';
import { JuradoSustentacion } from './entities/jurado-sustentacion.entity';
import { EvaluacionSustentacion } from './entities/evaluacion-sustentacion.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Sustentacion,
      JuradoSustentacion,
      EvaluacionSustentacion,
    ]),
  ],
  controllers: [SustentacionesController],
  providers: [SustentacionesService],
  exports: [SustentacionesService],
})
export class SustentacionesModule {}
