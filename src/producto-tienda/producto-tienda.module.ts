import { Module } from '@nestjs/common';
import { ProductoTiendaService } from './producto-tienda.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TiendaEntity } from 'src/tienda/tienda.entity';
import { ProductoEntity } from 'src/producto/producto.entity';
import { ProductoTiendaController } from './producto-tienda.controller';

@Module({
  providers: [ProductoTiendaService],
  imports: [TypeOrmModule.forFeature([TiendaEntity, ProductoEntity])],
  controllers: [ProductoTiendaController],
})
export class ProductoTiendaModule {}
