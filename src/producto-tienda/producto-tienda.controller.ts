import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors-interceptors';
import { ProductoTiendaService } from './producto-tienda.service';

@Controller('products')
@UseInterceptors(BusinessErrorsInterceptor)
export class ProductoTiendaController {
  constructor(private readonly productoTiendaService: ProductoTiendaService) {}
  @Post(':productoId/stores/:tiendaId')
  async addProductoToStore(
    @Param('tiendaId') tiendaId: string,
    @Param('productoId') productoId: string,
  ) {
    return await this.productoTiendaService.addStoreToProduct(
      tiendaId,
      productoId,
    );
  }
  @Get(':productoId/stores')
  async findPublicaconByForoIdPublicacionId(
    @Param('productoId') productoId: string,
  ) {
    return await this.productoTiendaService.findStoresFromProduct(productoId);
  }
  @Get(':productoId/stores/:tiendaId')
  async findtiendaByproducto(
    @Param('tiendaId') tiendaId: string,
    @Param('productoId') productoId: string,
  ) {
    return await this.productoTiendaService.findStoreFromProduct(
      productoId,
      tiendaId,
    );
  }
  @Put(':productoId/stores/:tiendaId')
  async updateProductoTienda(
    @Param('tiendaId') tiendaId: string,
    @Param('productoId') productoId: string,
  ) {
    return await this.productoTiendaService.updateStoresFromProduct(
      productoId,
      tiendaId,
    );
  }
  @Delete(':productoId/stores/:tiendaId')
  @HttpCode(204)
  async deleteStoreProduct(
    @Param('tiendaId') tiendaId: string,
    @Param('productoId') productoId: string,
  ) {
    return await this.productoTiendaService.deleteStoreFromProduct(
      tiendaId,
      productoId,
    );
  }
}
