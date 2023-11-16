import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductoEntity } from './producto.entity';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';

@Injectable()
export class ProductoService {
  constructor(
    @InjectRepository(ProductoEntity)
    private readonly productoRepository: Repository<ProductoEntity>,
  ) {}
  async findAll(): Promise<ProductoEntity[]> {
    return await this.productoRepository.find();
  }

  async findOne(id: string): Promise<ProductoEntity> {
    const producto: ProductoEntity = await this.productoRepository.findOne({
      where: { id },
      relations: ['tiendas'],
    });
    if (!producto)
      throw new BusinessLogicException(
        'The product with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return producto;
  }

  async create(producto: ProductoEntity): Promise<ProductoEntity> {
    if (!['Perecedero', 'No perecedero'].includes(producto.tipo)) {
      throw new BusinessLogicException(
        'The producto does not belong to the correct tipo',
        BusinessError.PRECONDITION_FAILED,
      );
    }
    return await this.productoRepository.save(producto);
  }

  async update(id: string, producto: ProductoEntity): Promise<ProductoEntity> {
    if (!['Perecedero', 'No perecedero'].includes(producto.tipo)) {
      throw new BusinessLogicException(
        'The producto does not belong to the correct tipo',
        BusinessError.PRECONDITION_FAILED,
      );
    }
    const persistedproducto: ProductoEntity =
      await this.productoRepository.findOne({
        where: { id },
        relations: ['tiendas'],
      });
    if (!persistedproducto)
      throw new BusinessLogicException(
        'The producto with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    producto.id = id;

    return await this.productoRepository.save({
      ...persistedproducto,
      ...producto,
    });
  }

  async delete(id: string) {
    const producto: ProductoEntity = await this.productoRepository.findOne({
      where: { id },
      relations: ['tiendas'],
    });
    if (!producto)
      throw new BusinessLogicException(
        'The producto with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    await this.productoRepository.remove(producto);
  }
}
