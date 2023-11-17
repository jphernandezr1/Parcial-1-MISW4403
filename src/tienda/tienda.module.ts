import { Module } from '@nestjs/common';
import { TiendaService } from './tienda.service';
import { TiendaEntity } from './tienda.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TiendaController } from './tienda.controller';

@Module({
  providers: [TiendaService],
  imports: [TypeOrmModule.forFeature([TiendaEntity])],
  controllers: [TiendaController],
})
export class TiendaModule {}
