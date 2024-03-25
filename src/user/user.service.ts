// user.service.ts

import { Injectable, Inject, forwardRef } from '@nestjs/common';
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
        
        @Inject(forwardRef(() => UserService))
        private readonly eventService: EventService,
    ) {}

    async findUserById(id: number): Promise<User> {
        return this.userRepository.findOne({where: {id: id}});
    }

    async createUser(userDto: UserDto): Promise<void> {
        const newUser = await this.mapDtoToEntity(userDto);
        this.userRepository.save(newUser);
    }

    async deleteUser(id: number): Promise<void> {
        this.userRepository.delete(id);
    }

    private async mapDtoToEntity(userDto:UserDto): Promise<User> {
        const newUser = new User();
        newUser.id = userDto.id;
        newUser.name = userDto.name;
        newUser.events = [];

        for (let i = 0; i < userDto.events.length; i++) {
            const currEvent = await this.eventService.getEventById(userDto.events[i]);
            newUser.events.push(currEvent);
        }

        return newUser;
    }
}
