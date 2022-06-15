import { Test, TestingModule } from '@nestjs/testing';
import { NeosbotController } from './neosbot.controller';

describe('NeosbotController', () => {
  let controller: NeosbotController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NeosbotController],
    }).compile();

    controller = module.get<NeosbotController>(NeosbotController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
