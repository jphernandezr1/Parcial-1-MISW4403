import 'dotenv/config';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TiendaModule } from './tienda/tienda.module';
import { ProductoModule } from './producto/producto.module';
import { ProductoTiendaModule } from './producto-tienda/producto-tienda.module';
import { TiendaEntity } from './tienda/tienda.entity';
import { ProductoEntity } from './producto/producto.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TiendaModule,
    ProductoModule,
    ProductoTiendaModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: 5432,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: 'apis-parcial',
      ssl: true,
      entities: [TiendaEntity, ProductoEntity],
      dropSchema: true,
      synchronize: true,
      keepConnectionAlive: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
