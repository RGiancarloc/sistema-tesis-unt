import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InformesService } from './informes.service';
import { InformesController } from './informes.controller';
import { InformeTesis } from './entities/informe-tesis.entity';
import { VersionInforme } from './entities/version-informe.entity';
import { RevisionInforme } from './entities/revision-informe.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      InformeTesis,
      VersionInforme,
      RevisionInforme,
    ]),
  ],
  controllers: [InformesController],
  providers: [InformesService],
  exports: [InformesService],
})
export class InformesModule {}
