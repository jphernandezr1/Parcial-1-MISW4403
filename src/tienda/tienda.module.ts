import { Module } from '@nestjs/common';
import { TiendaService } from './tienda.service';
import { TiendaEntity } from './tienda.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  providers: [TiendaService],
  imports: [TypeOrmModule.forFeature([TiendaEntity])],
})
export class TiendaModule {}
