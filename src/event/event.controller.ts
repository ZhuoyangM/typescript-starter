import { Controller, Post, Get, Param, Delete, Body } from '@nestjs/common';
import { EventService } from './event.service';
import { EventDto } from './event.dto';

@Controller('tasks')
export class EventController {
    constructor(private readonly eventService: EventService) {}

    @Post()
    async createTask(@Body() eventDto: EventDto): Promise<EventDto> {
        return this.eventService.createEvent(eventDto);
    }

    @Get(':id')
    async getEventById(@Param('id') id: number): Promise<EventDto> {
        return this.eventService.getEventById(id);
    }

    @Delete(':id')
    async deleteEvent(@Param('id') id: number): Promise<void> {
        return this.eventService.deleteEvent(id);
    }

    @Post('mergeAll')
    async mergeAllEvents(): Promise<string> {
        await this.eventService.mergeAllEvents();
        return 'All overlapping events merged successfully.';
    }
}
