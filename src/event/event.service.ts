import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './event.entity'; // Assuming you have a Task entity
import { EventDto } from './event.dto';
import { UserService } from 'src/user/user.service';
import { EventStatus } from './event.entity';

@Injectable()
export class EventService {
    constructor(
        @InjectRepository(Event)
        private readonly eventRepository: Repository<Event>,

        @Inject(forwardRef(() => UserService))
        private readonly userService: UserService,
    ) {}

    async createEvent(eventDto: EventDto): Promise<void>{
        const newEvent = await this.mapDtoToEntity(eventDto);
        this.eventRepository.save(newEvent);
    }

    async getEventById(id: number): Promise<Event> {
        const event = await this.eventRepository.findOne({where: {id: id}, relations: ['invitees'] })
        return event;
    }

    async deleteEvent(id: number): Promise<void> {
        this.eventRepository.delete(id);
    }

    private async mapDtoToEntity(eventDto: EventDto): Promise<Event> {
        const newEvent = new Event();
        newEvent.id = eventDto.id;
        newEvent.title = eventDto.title;
        newEvent.startTime = eventDto.startTime;
        newEvent.endTime = eventDto.endTime;
        newEvent.description = eventDto.description;
        newEvent.createdAt = eventDto.createdAt;
        newEvent.updatedAt = eventDto.updatedAt;
        newEvent.invitees = []

        switch (eventDto.status) {
            case 'TODO':
              newEvent.status = EventStatus.TODO;
              break;
            case 'IN_PROGRESS':
              newEvent.status = EventStatus.IN_PROGRESS;
              break;
            case 'COMPLETED':
              newEvent.status = EventStatus.COMPLETED;
              break;
        }

        for (let i = 0; i < eventDto.invitees.length; i++) {
            const currInvitee = await this.userService.findUserById(eventDto.invitees[i]);
            newEvent.invitees.push(currInvitee);
        }

        return newEvent;
    }
}
