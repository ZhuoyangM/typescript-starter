// user.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UserDto } from './user.dto';
import { EventService } from 'src/event/event.service';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly eventService: EventService,
    ) {}

    async findAll(): Promise<User[]> {
        return this.userRepository.find();
    }

    async findUserById(id: number): Promise<User> {
        return this.userRepository.findOne({where: {id: id}});
    }

    async create(userDto: UserDto): Promise<User> {
        const newUser = new User();
        newUser.id = userDto.id;
        newUser.name = userDto.name;
        newUser.events = [];

        for (let i = 0; i < userDto.events.length; i++) {
            // Retrieve event from event service
            const currEvent = await this.eventService.getEventById(userDto.events[i]);
            newUser.events.push(currEvent);
        }
        return this.userRepository.save(newUser);
    }

    async delete(id: number): Promise<void> {
        await this.userRepository.delete(id);
    }
}
