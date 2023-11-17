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
import { TiendaService } from './tienda.service';
import { TiendaEntity } from './tienda.entity';
@Controller('stores')
@UseInterceptors(BusinessErrorsInterceptor)
export class TiendaController {
  constructor(private readonly tiendaService: TiendaService) {}
  @Get()
  async findAll() {
    return await this.tiendaService.findAll();
  }
  @Get(':tiendaId')
  async findOne(@Param('tiendaId') tiendaId: string) {
    return await this.tiendaService.findOne(tiendaId);
  }
  @Post()
  async create(@Body() tienda) {
    const foro: TiendaEntity = plainToInstance(TiendaEntity, tienda);
    return await this.tiendaService.create(foro);
  }
  @Put(':tiendaId')
  async update(@Param('tiendaId') tiendaId: string, @Body() tienda) {
    const prod: TiendaEntity = plainToInstance(TiendaEntity, tienda);
    return await this.tiendaService.update(tiendaId, prod);
  }
  @Delete(':tiendaId')
  @HttpCode(204)
  async delete(@Param('tiendaId') tiendaId: string) {
    return await this.tiendaService.delete(tiendaId);
  }
}
