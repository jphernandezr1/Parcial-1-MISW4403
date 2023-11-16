import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TiendaEntity } from './tienda.entity';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';

@Injectable()
export class TiendaService {
  constructor(
    @InjectRepository(TiendaEntity)
    private readonly tiendaRepository: Repository<TiendaEntity>,
  ) {}
  async findAll(): Promise<TiendaEntity[]> {
    return await this.tiendaRepository.find();
  }

  async findOne(id: string): Promise<TiendaEntity> {
    const tienda: TiendaEntity = await this.tiendaRepository.findOne({
      where: { id },
      relations: ['productos'],
    });
    if (!tienda)
      throw new BusinessLogicException(
        'The tienda with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return tienda;
  }

  async create(tienda: TiendaEntity): Promise<TiendaEntity> {
    if (tienda.ciudad.length !== 3) {
      throw new BusinessLogicException(
        'The ciudad does not have the correct format',
        BusinessError.PRECONDITION_FAILED,
      );
    }
    return await this.tiendaRepository.save(tienda);
  }

  async update(id: string, tienda: TiendaEntity): Promise<TiendaEntity> {
    if (tienda.ciudad.length !== 3) {
      throw new BusinessLogicException(
        'The ciudad does not have the correct format',
        BusinessError.PRECONDITION_FAILED,
      );
    }
    const persistedtienda: TiendaEntity = await this.tiendaRepository.findOne({
      where: { id },
      relations: ['productos'],
    });
    if (!persistedtienda)
      throw new BusinessLogicException(
        'The tienda with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    tienda.id = id;

    return await this.tiendaRepository.save({
      ...persistedtienda,
      ...tienda,
    });
  }

  async delete(id: string) {
    const tienda: TiendaEntity = await this.tiendaRepository.findOne({
      where: { id },
      relations: ['productos'],
    });
    if (!tienda)
      throw new BusinessLogicException(
        'The tienda with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    await this.tiendaRepository.remove(tienda);
  }
}
