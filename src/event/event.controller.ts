import { Controller, Post, Get, Param, Delete, Body } from '@nestjs/common';
import { EventService } from './event.service';
import { EventDto } from './event.dto';
import { Event } from './event.entity';

@Controller('tasks')
export class EventController {
    constructor(private readonly eventService: EventService) {}

    @Post()
    async createEvent(@Body() eventDto: EventDto){
        this.eventService.createEvent(eventDto);
    }

    @Get(':id')
    async getEventById(@Param('id') id: number): Promise<EventDto> {
        const event = await this.eventService.getEventById(id);
        return this.mapEntityToDto(event);
    }

    @Delete(':id')
    async deleteEvent(@Param('id') id: number){
        this.eventService.deleteEvent(id);
    }

    @Post('mergeAll')
    async mergeAllEvents(): Promise<string> {
        await this.eventService.mergeAllEvents();
        return 'All overlapping events merged successfully.';
    }

    private mapEntityToDto(event: Event): EventDto {
        const eventDto: EventDto = {
            id: event.id,
            title: event.title,
            description: event.description,
            status: event.status,
            startTime: event.startTime,
            endTime: event.endTime,
            invitees: [],
        };
        
        for (let i = 0; i < event.invitees.length; i++) {
            const currId = event.invitees[i].id;
            eventDto.invitees.push(currId);
        }

        return eventDto;
    }
}
