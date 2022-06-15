import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Moment } from './moment.entity';
import { Photo } from './photo.entity';
import { Tag } from './tag.entity';
import { UserInfo } from './userinfo.entity';
import { NeosbotModule } from './neosbot/neosbot.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    TypeOrmModule.forFeature([Moment, Photo, Tag, UserInfo]),
    NeosbotModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
