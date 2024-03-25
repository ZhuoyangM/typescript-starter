// event.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { Event } from './event.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Event]), // Import the Event entity
  ],
  controllers: [EventController],
  providers: [EventService],
  exports: [EventService], // Optionally export the EventService for dependency injection
})
export class EventModule {}
