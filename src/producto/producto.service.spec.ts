import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmTestingConfig } from '../shared/testing-utils';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { ProductoEntity } from './producto.entity';
import { ProductoService } from './producto.service';
import { randomUUID } from 'crypto';

describe('ProductoService', () => {
  let service: ProductoService;
  let repository: Repository<ProductoEntity>;
  let productosList: ProductoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ProductoService],
    }).compile();

    service = module.get<ProductoService>(ProductoService);
    repository = module.get<Repository<ProductoEntity>>(
      getRepositoryToken(ProductoEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    productosList = [];
    for (let i = 0; i < 5; i++) {
      const producto: ProductoEntity = await repository.save({
        nombre: faker.commerce.product(),
        precio: faker.number.int(),
        tipo: faker.image.url(),
      });
      productosList.push(producto);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all productos', async () => {
    const productos: ProductoEntity[] = await service.findAll();
    expect(productos).not.toBeNull();
    expect(productos).toHaveLength(productosList.length);
  });

  it('findOne should return a producto by id', async () => {
    const storedproducto: ProductoEntity = productosList[0];
    const producto: ProductoEntity = await service.findOne(storedproducto.id);
    expect(producto).not.toBeNull();
    expect(producto.nombre).toEqual(storedproducto.nombre);
    expect(producto.precio).toEqual(storedproducto.precio);
    expect(producto.tipo).toEqual(storedproducto.tipo);
  });

  it('findOne should throw an exception for an invalid producto', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'The product with the given id was not found',
    );
  });

  it('create should return a new producto', async () => {
    const producto: ProductoEntity = {
      id: randomUUID(),
      nombre: faker.commerce.product(),
      precio: 1,
      tipo: 'Perecedero',
      tiendas: [],
    };

    const newproducto: ProductoEntity = await service.create(producto);
    expect(newproducto).not.toBeNull();

    const storedproducto: ProductoEntity = await repository.findOne({
      where: { id: newproducto.id },
    });
    expect(storedproducto).not.toBeNull();
    expect(newproducto.nombre).toEqual(storedproducto.nombre);
    expect(newproducto.precio).toEqual(storedproducto.precio);
    expect(newproducto.tipo).toEqual(storedproducto.tipo);
  });

  it('create should throw an exception for an invalid tipo', async () => {
    const producto: ProductoEntity = {
      id: randomUUID(),
      nombre: faker.commerce.product(),
      precio: 1,
      tipo: 'Otros Perecedero',
      tiendas: [],
    };
    await expect(() => service.create(producto)).rejects.toHaveProperty(
      'message',
      'The producto does not belong to the correct tipo',
    );
  });

  it('update should modify a producto', async () => {
    const producto: ProductoEntity = productosList[0];
    producto.nombre = 'New name';
    producto.tipo = 'No perecedero';

    const updatedMuseum: ProductoEntity = await service.update(
      producto.id,
      producto,
    );
    expect(updatedMuseum).not.toBeNull();

    const storedproducto: ProductoEntity = await repository.findOne({
      where: { id: producto.id },
    });
    expect(storedproducto).not.toBeNull();
    expect(storedproducto.nombre).toEqual(producto.nombre);
    expect(storedproducto.tipo).toEqual(producto.tipo);
  });

  it('update should throw an exception for an invalid producto', async () => {
    let producto: ProductoEntity = productosList[0];
    producto = {
      ...producto,
      nombre: 'New name',
      tipo: 'Perecedero',
    };
    await expect(() => service.update('0', producto)).rejects.toHaveProperty(
      'message',
      'The producto with the given id was not found',
    );
  });

  it('update should throw an exception for an invalid tipo', async () => {
    let producto: ProductoEntity = productosList[0];
    producto = {
      ...producto,
      nombre: 'New name',
      tipo: 'Perecedero otros',
    };
    await expect(() =>
      service.update(producto.id, producto),
    ).rejects.toHaveProperty(
      'message',
      'The producto does not belong to the correct tipo',
    );
  });

  it('delete should remove a producto', async () => {
    const producto: ProductoEntity = productosList[0];
    await service.delete(producto.id);

    const deletedMuseum: ProductoEntity = await repository.findOne({
      where: { id: producto.id },
    });
    expect(deletedMuseum).toBeNull();
  });

  it('delete should throw an exception for an invalid producto', async () => {
    const producto: ProductoEntity = productosList[0];
    await service.delete(producto.id);
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'The producto with the given id was not found',
    );
  });
});
