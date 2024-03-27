import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './event.entity'; // Assuming you have a Task entity
import { EventDto } from './event.dto';
import { UserService } from '../user/user.service';
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
        return this.eventRepository.findOne({where: {id: id}, relations: ['invitees'] });
    }

    async deleteEvent(id: number): Promise<void> {
        this.eventRepository.delete(id);
    }

    async mergeAll(userId: number): Promise<Event[]> {
        const userEvents = await this.findEventsByUserId(userId);
    
        // Merge events
        const mergedEvents = this.getMergedEvents(userEvents);
        
        console.log(mergedEvents);
        
        await Promise.all(
          mergedEvents.map(async (event) => {
            await this.eventRepository.save(event);
          }),
        );
          
        // Delete unused events
        const eventsToDelete = this.getOldEvents(userEvents, mergedEvents);
        await Promise.all(eventsToDelete.map(async (event) => {
            await this.eventRepository.remove(event);
        }));
    
        // Return the updated events
        return mergedEvents;
    }
    
    // Helper methods
    private async findEventsByUserId(userId: number): Promise<Event[]> {
      return this.eventRepository.createQueryBuilder('event')
        .leftJoinAndSelect('event.invitees', 'user')
        .where('user.id = :userId', { userId })
        .getMany();
    }

    private getMergedEvents(events: Event[]): Event[] {
        events.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
      
        const mergedEvents: Event[] = [];
        let currentEvent: Event = null;
      
        for (const event of events) {
          if (!currentEvent || currentEvent.endTime < event.startTime) {
            mergedEvents.push(event);
            currentEvent = event;
          } else if (currentEvent.endTime >= event.startTime && currentEvent.endTime <= event.endTime) {
            currentEvent.endTime = event.endTime;
          // Merge invitee lists
            for (const invitee of event.invitees) {
                if (!currentEvent.invitees.some(existingInvitee => existingInvitee.id === invitee.id)) {
                  currentEvent.invitees.push(invitee);
                }
            }
          }
        }
        return mergedEvents;
    }

    private getOldEvents(userEvents: Event[], mergedEvents: Event[]): Event[] {
        const eventsToDelete = userEvents.filter((event) => !mergedEvents.find((mergedEvent) => mergedEvent.id === event.id));
        return eventsToDelete;
    }
    
      
    async mapDtoToEntity(eventDto: EventDto): Promise<Event> {
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
