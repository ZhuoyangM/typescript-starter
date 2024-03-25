import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './event.entity'; // Assuming you have a Task entity
import { EventDto } from './event.dto';

@Injectable()
export class EventService {
    constructor(
        @InjectRepository(Event)
        private readonly eventRepository: Repository<Event>,
    ) {}

    async createEvent(eventDto: EventDto): Promise<Event> {
        const event = this.eventRepository.create(eventDto);
        return this.eventRepository.save(event);
    }

    async getEventById(id: number): Promise<Event> {
        return this.eventRepository.findOne(id);
    }

    async deleteEvent(id: number): Promise<void> {
        await this.eventRepository.delete(id);
    }

    async mergeAllEvents(): Promise<void> {
        // Implement merging logic here
    }
}
