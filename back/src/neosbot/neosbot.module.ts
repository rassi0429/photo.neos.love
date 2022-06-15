import { Module } from '@nestjs/common';
import { NeosbotController } from './neosbot.controller';
import { NeosbotService } from './neosbot.service';

@Module({
  controllers: [NeosbotController],
  providers: [NeosbotService],
  exports: [NeosbotService],
})
export class NeosbotModule {}
