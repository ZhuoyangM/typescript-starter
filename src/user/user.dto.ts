import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
    @ApiProperty()
    readonly id: number;

    @ApiProperty()
    readonly name: string;

    @ApiProperty()
    readonly events: number[];
}