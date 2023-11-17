import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductoEntity } from '../producto/producto.entity';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { TiendaEntity } from '../tienda/tienda.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductoTiendaService {
  constructor(
    @InjectRepository(ProductoEntity)
    private readonly productoRepository: Repository<ProductoEntity>,
    @InjectRepository(TiendaEntity)
    private readonly tiendaRepository: Repository<TiendaEntity>,
  ) {}

  async addStoreToProduct(tienda_id: string, producto_id: string) {
    const producto: ProductoEntity = await this.productoRepository.findOne({
      where: { id: producto_id },
      relations: ['tiendas'],
    });
    if (!producto)
      throw new BusinessLogicException(
        'The producto with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const tienda: TiendaEntity = await this.tiendaRepository.findOne({
      where: { id: tienda_id },
      relations: ['productos'],
    });
    if (!tienda)
      throw new BusinessLogicException(
        'The tienda with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    producto.tiendas.push(tienda);
    tienda.productos.push(producto);
    await this.productoRepository.save(producto);
    await this.tiendaRepository.save(tienda);
  }

  async findStoresFromProduct(producto_id: string): Promise<TiendaEntity[]> {
    const producto: ProductoEntity = await this.productoRepository.findOne({
      where: { id: producto_id },
      relations: ['tiendas'],
    });
    if (!producto)
      throw new BusinessLogicException(
        'The producto with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    return producto.tiendas;
  }

  async findStoreFromProduct(
    producto_id: string,
    tienda_id: string,
  ): Promise<TiendaEntity> {
    const producto: ProductoEntity = await this.productoRepository.findOne({
      where: { id: producto_id },
      relations: ['tiendas'],
    });
    if (!producto)
      throw new BusinessLogicException(
        'The producto with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    const tienda = producto.tiendas.find((tienda) => tienda.id === tienda_id);
    if (!tienda) {
      throw new BusinessLogicException(
        'The tienda with the given id was not found or do not belong to that product',
        BusinessError.NOT_FOUND,
      );
    }
    return tienda;
  }

  async updateStoresFromProduct(producto_id: string, tienda_id: string) {
    const producto: ProductoEntity = await this.productoRepository.findOne({
      where: { id: producto_id },
      relations: ['tiendas'],
    });
    if (!producto)
      throw new BusinessLogicException(
        'The producto with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    const tienda: TiendaEntity = await this.tiendaRepository.findOne({
      where: { id: tienda_id },
      relations: ['productos'],
    });
    if (!tienda)
      throw new BusinessLogicException(
        'The tienda with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    tienda.productos = tienda.productos.filter(
      (producto_2) => producto_2.id !== producto.id,
    );
    producto.tiendas = producto.tiendas.filter(
      (tienda_2) => tienda_2.id !== tienda.id,
    );
    await this.productoRepository.save(producto);
    await this.tiendaRepository.save(tienda);
    return tienda;
  }

  async deleteStoreFromProduct(tienda_id: string, producto_id: string) {
    const producto: ProductoEntity = await this.productoRepository.findOne({
      where: { id: producto_id },
      relations: ['tiendas'],
    });
    if (!producto)
      throw new BusinessLogicException(
        'The producto with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const tienda: TiendaEntity = await this.tiendaRepository.findOne({
      where: { id: tienda_id },
      relations: ['productos'],
    });
    if (!tienda)
      throw new BusinessLogicException(
        'The tienda with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const prod = tienda.productos.find((produc) => produc.id === producto.id);
    if (!prod) {
      throw new BusinessLogicException(
        'The tienda do not have that product',
        BusinessError.NOT_FOUND,
      );
    }
    for (const prods of tienda.productos) {
      const producto_2: ProductoEntity = await this.productoRepository.findOne({
        where: { id: prods.id },
        relations: ['tiendas'],
      });
      producto_2.tiendas = producto_2.tiendas.filter(
        (tienda_pers) => tienda_pers.id !== tienda.id,
      );
      await this.productoRepository.save(producto_2);
    }
    const tienda_2: TiendaEntity = await this.tiendaRepository.findOne({
      where: { id: tienda_id },
    });
    if (!tienda_2)
      throw new BusinessLogicException(
        'The tienda with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    await this.tiendaRepository.delete(tienda_2);
  }
}
