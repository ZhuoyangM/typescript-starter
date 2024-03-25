// user.controller.ts

import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { UserDto } from './user.dto';
import { UserService } from './user.service';
import { User } from './user.entity';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    async findAll(): Promise<User[]> {
        return this.userService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<User> {
        return this.userService.findOne(+id);
    }

    @Post()
    async create(@Body() userDto: UserDto): Promise<User> {
        return this.userService.create(userDto);
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<void> {
        return this.userService.delete(+id);
    }
}
