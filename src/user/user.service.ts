// user.service.ts

import { Injectable, Inject, forwardRef } from '@nestjs/common';
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

    async findUserById(id: number): Promise<User> {
        return this.userRepository.findOne({ where: {id: id} });
    }

    async createUser(userDto: UserDto): Promise<void> {
        const newUser = await this.mapDtoToEntity(userDto);
        this.userRepository.save(newUser);
    }

    async deleteUser(id: number): Promise<void> {
        this.userRepository.delete(id);
    }

    async mapDtoToEntity(userDto:UserDto): Promise<User> {
        const newUser = new User();
        newUser.id = userDto.id;
        newUser.name = userDto.name;
        return newUser;
    }
}
