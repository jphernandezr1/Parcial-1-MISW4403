import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmTestingConfig } from '../shared/testing-utils';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProductoTiendaService } from './producto-tienda.service';
import { ProductoEntity } from '../producto/producto.entity';
import { TiendaEntity } from '../tienda/tienda.entity';
import { BusinessLogicException } from '../shared/errors/business-errors';

describe('ProductoTiendaService', () => {
  let service: ProductoTiendaService;
  let productoRepository: Repository<ProductoEntity>;
  let tiendaRepository: Repository<TiendaEntity>;
  let productosList: ProductoEntity[];
  let tiendasList: TiendaEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ProductoTiendaService],
    }).compile();

    service = module.get<ProductoTiendaService>(ProductoTiendaService);
    productoRepository = module.get<Repository<ProductoEntity>>(
      getRepositoryToken(ProductoEntity),
    );
    tiendaRepository = module.get<Repository<TiendaEntity>>(
      getRepositoryToken(TiendaEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    await productoRepository.clear();
    await tiendaRepository.clear();

    productosList = [];
    tiendasList = [];

    for (let i = 0; i < 5; i++) {
      const producto: ProductoEntity = await productoRepository.save({
        nombre: faker.commerce.product(),
        precio: faker.number.int(),
        tipo: faker.image.url(),
      });

      const tienda: TiendaEntity = await tiendaRepository.save({
        nombre: faker.commerce.product(),
        ciudad: faker.commerce.productDescription(),
        direccion: faker.commerce.department(),
      });

      await service.addStoreToProduct(tienda.id, producto.id);
      tiendasList.push(tienda);
      productosList.push(producto);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addStoreToProduct should add a tienda to a product', async () => {
    const producto: ProductoEntity = await productoRepository.save({
      nombre: faker.commerce.product(),
      precio: faker.number.int(),
      tipo: faker.image.url(),
    });

    const tienda: TiendaEntity = await tiendaRepository.save({
      nombre: faker.commerce.product(),
      ciudad: faker.commerce.productDescription(),
      direccion: faker.commerce.department(),
    });

    const result: TiendaEntity = await service.addStoreToProduct(
      tienda.id,
      producto.id,
    );

    expect(result.productos.length).toBe(1);
    expect(result.productos[0]).not.toBeNull();
    expect(producto.nombre).toEqual(result.productos[0].nombre);
    expect(producto.precio).toEqual(result.productos[0].precio);
    expect(producto.tipo).toEqual(result.productos[0].tipo);
  });

  it('addStoreToProduct should thrown exception for an invalid tienda', async () => {
    try {
      // Create a producto, but don't create a tienda
      const producto: ProductoEntity = await productoRepository.save({
        nombre: faker.commerce.product(),
        precio: faker.number.int(),
        tipo: faker.image.url(),
      });

      // Attempt to add a non-existent tienda to the producto
      await service.addStoreToProduct('nonExistentTiendaId', producto.id);
    } catch (error) {
      expect(error).toBeInstanceOf(BusinessLogicException);
      expect(error.message).toContain(
        'The tienda with the given id was not found',
      );
    }
  });

  it('addStoreToProduct should throw an exception for an invalid producto', async () => {
    try {
      // Create a tienda, but don't create a producto
      const tienda: TiendaEntity = await tiendaRepository.save({
        nombre: faker.commerce.product(),
        ciudad: faker.commerce.productDescription(),
        direccion: faker.commerce.department(),
      });

      // Attempt to add the tienda to a non-existent producto
      await service.addStoreToProduct(tienda.id, 'nonExistentProductoId');
    } catch (error) {
      expect(error).toBeInstanceOf(BusinessLogicException);
      expect(error.message).toContain(
        'The producto with the given id was not found',
      );
    }
  });

  it('findStoresFromProduct should return stores', async () => {
    // Create a producto and associated tiendas
    const producto: ProductoEntity = productosList[0];

    // Retrieve stores associated with the producto
    const result: TiendaEntity[] = await service.findStoresFromProduct(
      producto.id,
    );

    expect(result.length).toBeGreaterThan(0);
    expect(
      result.every((tienda) => tienda instanceof TiendaEntity),
    ).toBeTruthy();
  });

  it('findStoresFromProduct should trhow an exception for an invalid product', async () => {
    try {
      // Attempt to retrieve stores for a non-existent producto
      await service.findStoresFromProduct('nonExistentProductoId');
    } catch (error) {
      expect(error).toBeInstanceOf(BusinessLogicException);
      expect(error.message).toContain(
        'The producto with the given id was not found',
      );
    }
  });

  it('findStoreFromProduct should return a store', async () => {
    // Create a producto and associated tiendas
    const producto: ProductoEntity = productosList[0];
    const tienda: TiendaEntity = tiendasList[0];

    // Retrieve a specific store associated with the producto
    const result: TiendaEntity = await service.findStoreFromProduct(
      producto.id,
      tienda.id,
    );

    expect(result).toBeInstanceOf(TiendaEntity);
    expect(result.id).toEqual(tienda.id);
  });

  it('findStoreFromProduct should trhow an exception for an invalid product', async () => {
    try {
      // Create a tienda
      const tienda: TiendaEntity = tiendasList[0];

      // Attempt to retrieve a store for a non-existent producto
      await service.findStoreFromProduct('nonExistentProductoId', tienda.id);
    } catch (error) {
      expect(error).toBeInstanceOf(BusinessLogicException);
      expect(error.message).toContain(
        'The producto with the given id was not found',
      );
    }
  });

  it('findStoreFromProduct should trhow an exception for an invalid tienda', async () => {
    try {
      // Create a producto
      const producto: ProductoEntity = productosList[0];

      // Attempt to retrieve a store with an invalid tienda
      await service.findStoreFromProduct(producto.id, 'nonExistentTiendaId');
    } catch (error) {
      expect(error).toBeInstanceOf(BusinessLogicException);
      expect(error.message).toContain(
        'The tienda with the given id was not found',
      );
    }
  });

  it('updateStoresFromProduct should update the product from a tienda', async () => {
    // Create a producto and associated tiendas
    const producto: ProductoEntity = productosList[0];
    const tienda: TiendaEntity = tiendasList[0];

    // Update the stores associated with the producto by removing the association with a specific tienda
    await service.updateStoresFromProduct(producto.id, tienda.id);

    // Retrieve the updated producto
    const updatedProducto: ProductoEntity = await productoRepository.findOne({
      where: { id: producto.id },
      relations: ['tiendas'],
    });

    expect(updatedProducto.tiendas.length).toBe(0);
  });

  it('updateStoresFromProduct should trhow an exception for an invalid product', async () => {
    try {
      // Create a tienda
      const tienda: TiendaEntity = tiendasList[0];

      // Attempt to update stores for a non-existent producto
      await service.updateStoresFromProduct('nonExistentProductoId', tienda.id);
    } catch (error) {
      expect(error).toBeInstanceOf(BusinessLogicException);
      expect(error.message).toContain(
        'The producto with the given id was not found',
      );
    }
  });

  it('updateStoresFromProduct should trhow an exception for an invalid tienda', async () => {
    try {
      // Create a producto
      const producto: ProductoEntity = productosList[0];

      // Attempt to update stores with an invalid tienda
      await service.updateStoresFromProduct(producto.id, 'nonExistentTiendaId');
    } catch (error) {
      expect(error).toBeInstanceOf(BusinessLogicException);
      expect(error.message).toContain(
        'The tienda with the given id was not found',
      );
    }
  });
  it('deleteStoreFromProduct should delete a store and remove the store from the products', async () => {
    // Create a producto and associated tiendas
    const producto: ProductoEntity = productosList[0];
    const tienda: TiendaEntity = tiendasList[0];

    // Delete the tienda from the producto and remove the tienda
    await service.deleteStoreFromProduct(tienda.id, producto.id);

    // Retrieve the updated producto
    const updatedProducto: ProductoEntity = await productoRepository.findOne({
      where: { id: producto.id },
      relations: ['tiendas'],
    });

    // Retrieve the tienda after deletion
    const deletedTienda: TiendaEntity = await tiendaRepository.findOne({
      where: { id: tienda.id },
    });

    expect(updatedProducto.tiendas.length).toBe(0);
    expect(deletedTienda).toBe(null);
  });
  it('updateStoresFromProduct should trhow an exception for an invalid product', async () => {
    try {
      // Create a tienda
      const tienda: TiendaEntity = tiendasList[0];

      // Attempt to delete stores for a non-existent producto
      await service.deleteStoreFromProduct(tienda.id, 'nonExistentProductoId');
    } catch (error) {
      expect(error).toBeInstanceOf(BusinessLogicException);
      expect(error.message).toContain(
        'The producto with the given id was not found',
      );
    }
  });

  it('updateStoresFromProduct should trhow an exception for an invalid tienda', async () => {
    try {
      // Create a producto
      const producto: ProductoEntity = productosList[0];

      // Attempt to delete stores with an invalid tienda
      await service.deleteStoreFromProduct('nonExistentTiendaId', producto.id);
    } catch (error) {
      expect(error).toBeInstanceOf(BusinessLogicException);
      expect(error.message).toContain(
        'The tienda with the given id was not found',
      );
    }
  });

  it('updateStoresFromProduct should trhow an exception for an product that don not belong to a tienda', async () => {
    try {
      // Create a producto and tienda
      const producto: ProductoEntity = productosList[0];
      const tienda: TiendaEntity = tiendasList[1];

      // Attempt to delete a store that does not belong to the specified tienda
      await service.deleteStoreFromProduct(tienda.id, producto.id);
    } catch (error) {
      expect(error).toBeInstanceOf(BusinessLogicException);
      expect(error.message).toContain('The tienda do not have that product');
    }
  });
});
