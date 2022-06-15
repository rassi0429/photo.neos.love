import { Test, TestingModule } from '@nestjs/testing';
import { NeosbotService } from './neosbot.service';

describe('NeosbotService', () => {
  let service: NeosbotService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NeosbotService],
    }).compile();

    service = module.get<NeosbotService>(NeosbotService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
