// user.controller.ts

import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { UserDto } from './user.dto';
import { UserService } from './user.service';
import { User } from './user.entity';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get(':id')
    async findOne(@Param('id') id: number): Promise<UserDto> {
        const user = await this.userService.findUserById(id);
        return this.mapEntityToDto(user);
    }

    @Post()
    async createUser(@Body() userDto: UserDto): Promise<void> {
        this.userService.createUser(userDto);
    }

    @Delete(':id')
    async deleteUser(@Param('id') id: number): Promise<void> {
        this.userService.deleteUser(id);
    }

    private mapEntityToDto(user: User): UserDto {
        const userDto = new UserDto();
        userDto.id = user.id;
        userDto.name = user.name;
        userDto.events = [];

        for (let i = 0; i < user.events.length; i++) {
            const currId = user.events[i].id;
            userDto.events.push(currId);
        }

        return userDto;
    }


}
