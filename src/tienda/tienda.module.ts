import { Module } from '@nestjs/common';
import { TiendaService } from './tienda.service';

@Module({
  providers: [TiendaService],
})
export class TiendaModule {}
