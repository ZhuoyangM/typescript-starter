// user.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UserDto } from './user.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
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
        newUser.events = userDto.events;
        return this.userRepository.save(newUser);
    }

    async delete(id: number): Promise<void> {
        await this.userRepository.delete(id);
    }
}
