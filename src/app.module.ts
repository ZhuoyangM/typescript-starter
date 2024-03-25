import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { User } from './user/user.entity';
import { UserModule } from './user/user.module';

import { Event } from './event/event.entity';
import { EventModule } from './event/event.module';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: "db",
      port: 5000,
      password: "nest",
      username: "nest",
      database: "nest",
      entities: [User, Event],
      synchronize: true,
      logging: true,
    }),
    
    UserModule,
    EventModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
