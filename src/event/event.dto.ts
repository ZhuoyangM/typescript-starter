// event.dto.ts

import { ApiProperty } from '@nestjs/swagger';

export class EventDto {
    @ApiProperty()
    readonly id: number;

    @ApiProperty()
    readonly title: string;

    @ApiProperty()
    readonly description: string;

    @ApiProperty()
    readonly status: string;

    @ApiProperty()
    readonly startTime: Date;

    @ApiProperty()
    readonly endTime: Date;

    @ApiProperty()
    readonly invitees: number[]; // Array of user IDs

    // Other properties as needed
}
