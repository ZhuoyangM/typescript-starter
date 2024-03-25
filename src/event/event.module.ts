// event.module.ts

import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { Event } from './event.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  imports:[
    TypeOrmModule.forFeature([Event]),
    forwardRef(() => UserModule),
  ],
  controllers: [EventController],
  providers: [EventService],
  exports: [EventService],
})
export class EventModule {}
