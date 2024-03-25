// event.dto.ts

import { ApiProperty } from '@nestjs/swagger';

export class EventDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    title: string;

    @ApiProperty()
    description: string;

    @ApiProperty()
    status: string;

    @ApiProperty()
    startTime: Date;

    @ApiProperty()
    endTime: Date;

    @ApiProperty()
    invitees: number[];
}
