import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors-interceptors';
import { ProductoService } from './producto.service';
import { ProductoEntity } from './producto.entity';
@Controller('products')
@UseInterceptors(BusinessErrorsInterceptor)
export class ProductoController {
  constructor(private readonly productoService: ProductoService) {}
  @Get()
  async findAll() {
    return await this.productoService.findAll();
  }
  @Get(':productoId')
  async findOne(@Param('productoId') productoId: string) {
    return await this.productoService.findOne(productoId);
  }
  @Post()
  async create(@Body() producto) {
    const foro: ProductoEntity = plainToInstance(ProductoEntity, producto);
    return await this.productoService.create(foro);
  }
  @Put(':productoId')
  async update(@Param('productoId') productoId: string, @Body() producto) {
    const prod: ProductoEntity = plainToInstance(ProductoEntity, producto);
    return await this.productoService.update(productoId, prod);
  }
  @Delete(':productoId')
  @HttpCode(204)
  async delete(@Param('productoId') productoId: string) {
    return await this.productoService.delete(productoId);
  }
}
