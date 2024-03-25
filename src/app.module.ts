import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { User } from './user/user.entity';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';

import { Event } from './event/event.entity';
import { EventController } from './event/event.controller';
import { EventService } from './event/event.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT) || 5432,
      password: process.env.DB_PASSWORD,
      username: process.env.DB_USER,
      database: process.env.DB_NAME,
      entities: [User, Event],
      synchronize: true,
      logging: true,
    }),
  ],
  controllers: [AppController, UserController, EventController],
  providers: [AppService, UserService, EventService],
})
export class AppModule {}
