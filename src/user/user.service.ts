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

    async findOne(id: number): Promise<User> {
        return this.userRepository.findOne(id);
    }

    async create(userDto: UserDto): Promise<User> {
        const user = this.userRepository.create(userDto);
        return this.userRepository.save(user);
    }

    async delete(id: number): Promise<void> {
        await this.userRepository.delete(id);
    }
}
