import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmTestingConfig } from '../shared/testing-utils';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { randomUUID } from 'crypto';
import { TiendaService } from './tienda.service';
import { TiendaEntity } from './tienda.entity';

describe('TiendaService', () => {
  let service: TiendaService;
  let repository: Repository<TiendaEntity>;
  let tiendasList: TiendaEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [TiendaService],
    }).compile();

    service = module.get<TiendaService>(TiendaService);
    repository = module.get<Repository<TiendaEntity>>(
      getRepositoryToken(TiendaEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    tiendasList = [];
    for (let i = 0; i < 5; i++) {
      const tienda: TiendaEntity = await repository.save({
        nombre: faker.commerce.product(),
        ciudad: faker.commerce.productDescription(),
        direccion: faker.commerce.department(),
      });
      tiendasList.push(tienda);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all tiendas', async () => {
    const tiendas: TiendaEntity[] = await service.findAll();
    expect(tiendas).not.toBeNull();
    expect(tiendas).toHaveLength(tiendasList.length);
  });

  it('findOne should return a tienda by id', async () => {
    const storedtienda: TiendaEntity = tiendasList[0];
    const tienda: TiendaEntity = await service.findOne(storedtienda.id);
    expect(tienda).not.toBeNull();
    expect(tienda.nombre).toEqual(storedtienda.nombre);
    expect(tienda.ciudad).toEqual(storedtienda.ciudad);
    expect(tienda.direccion).toEqual(storedtienda.direccion);
  });

  it('findOne should throw an exception for an invalid tienda', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'The tienda with the given id was not found',
    );
  });

  it('create should return a new tienda', async () => {
    const tienda: TiendaEntity = {
      id: randomUUID(),
      nombre: faker.commerce.product(),
      ciudad: 'MED',
      direccion: faker.commerce.department(),
      productos: [],
    };

    const newtienda: TiendaEntity = await service.create(tienda);
    expect(newtienda).not.toBeNull();

    const storedtienda: TiendaEntity = await repository.findOne({
      where: { id: newtienda.id },
    });
    expect(storedtienda).not.toBeNull();
    expect(newtienda.nombre).toEqual(storedtienda.nombre);
    expect(newtienda.ciudad).toEqual(storedtienda.ciudad);
    expect(newtienda.direccion).toEqual(storedtienda.direccion);
  });

  it('create should throw an exception for an invalid ciudad', async () => {
    const tienda: TiendaEntity = {
      id: randomUUID(),
      nombre: faker.commerce.product(),
      ciudad: 'MEDELLIN',
      direccion: faker.commerce.department(),
      productos: [],
    };
    await expect(() => service.create(tienda)).rejects.toHaveProperty(
      'message',
      'The ciudad does not have the correct format',
    );
  });

  it('update should modify a tienda', async () => {
    const tienda: TiendaEntity = tiendasList[0];
    tienda.nombre = 'New name';
    tienda.ciudad = 'BOG';

    const updatedMuseum: TiendaEntity = await service.update(tienda.id, tienda);
    expect(updatedMuseum).not.toBeNull();

    const storedtienda: TiendaEntity = await repository.findOne({
      where: { id: tienda.id },
    });
    expect(storedtienda).not.toBeNull();
    expect(storedtienda.nombre).toEqual(tienda.nombre);
    expect(storedtienda.ciudad).toEqual(tienda.ciudad);
  });

  it('update should throw an exception for an invalid tienda', async () => {
    let tienda: TiendaEntity = tiendasList[0];
    tienda = {
      ...tienda,
      nombre: 'New name',
      ciudad: 'BOG',
    };
    await expect(() => service.update('0', tienda)).rejects.toHaveProperty(
      'message',
      'The tienda with the given id was not found',
    );
  });

  it('update should throw an exception for an invalid ciudad', async () => {
    let tienda: TiendaEntity = tiendasList[0];
    tienda = {
      ...tienda,
      nombre: 'New name',
      ciudad: 'bogota',
    };
    await expect(() =>
      service.update(tienda.id, tienda),
    ).rejects.toHaveProperty(
      'message',
      'The ciudad does not have the correct format',
    );
  });

  it('delete should remove a tienda', async () => {
    const tienda: TiendaEntity = tiendasList[0];
    await service.delete(tienda.id);

    const deletedMuseum: TiendaEntity = await repository.findOne({
      where: { id: tienda.id },
    });
    expect(deletedMuseum).toBeNull();
  });

  it('delete should throw an exception for an invalid tienda', async () => {
    const tienda: TiendaEntity = tiendasList[0];
    await service.delete(tienda.id);
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'The tienda with the given id was not found',
    );
  });
});
