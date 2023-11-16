import { Test, TestingModule } from '@nestjs/testing';
import { TiendaService } from './tienda.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils';

describe('TiendaService', () => {
  let service: TiendaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [TiendaService],
    }).compile();

    service = module.get<TiendaService>(TiendaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
