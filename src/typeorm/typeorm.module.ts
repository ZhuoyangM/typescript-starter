// typeorm.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from '../event/event.entity'; // Import your entities here
import { User } from '../user/user.entity';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres', // Or the database type you're using
            host: 'localhost',
            port: 5432,
            username: 'username',
            password: 'password',
            database: 'dbname',
            entities: [User,Event], // Add your entities here
            synchronize: true, // Automatically synchronize the database schema
        }),
        TypeOrmModule.forFeature([Event]), // Register your entities for dependency injection
    ],
})
export class TypeOrmModule {}
