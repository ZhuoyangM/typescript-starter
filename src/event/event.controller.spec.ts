import { Test, TestingModule } from '@nestjs/testing';
import { Repository, PrimaryGeneratedColumn } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Event } from './event.entity';
import { EventDto } from './event.dto';
import { EventService } from './event.service';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';
import { UserDto } from 'src/user/user.dto';
  

describe('EventService', () => {
    let eventService: EventService;
    let eventRepository: Repository<Event>;
    let userService: UserService;
    let userRepository: Repository<User>;
  
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          EventService,
          UserService,
          {
            provide: getRepositoryToken(Event),
            useClass: Repository,
          },
          {
            provide: getRepositoryToken(User),
            useClass: Repository,
          }
        ],
      }).compile();
  
      eventService = module.get<EventService>(EventService);
      eventRepository = module.get<Repository<Event>>(getRepositoryToken(Event));
      userService = module.get<UserService>(UserService);
      userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    });
  
    it('should be defined', () => {
      expect(eventService).toBeDefined();
    });
  
    it('Create, read, delete, read again', async () => {
      const eventDto = new EventDto();
      eventDto['id'] = 1;
      eventDto['title'] = "cf";
      eventDto["description"] = "cf";
      eventDto["status"] = "COMPLETED";
      eventDto["startTime"] = new Date("2023-09-01");
      eventDto["endTime"] = new Date("2023-09-03");
        
      const newEvent = new Event();
      Object.assign(newEvent, eventDto);
      jest.spyOn(eventService, 'mapDtoToEntity').mockResolvedValue(newEvent);
      jest.spyOn(eventRepository, 'save').mockResolvedValue(undefined);
      await eventService.createEvent(eventDto);
      expect(eventService.mapDtoToEntity).toHaveBeenCalledWith(eventDto);
      expect(eventRepository.save).toHaveBeenCalledWith(newEvent);
  
      const event = new Event();
      event.id = 1;
      jest.spyOn(eventRepository, 'findOne').mockResolvedValue(event);
      const foundEvent = await eventService.getEventById(event.id);
      expect(foundEvent.id).toEqual(event.id);
      expect(eventRepository.findOne).toHaveBeenCalledWith({ where: { id: event.id }, relations: ['invitees'] });
  
      jest.spyOn(eventRepository, 'delete').mockResolvedValue(undefined);
      await eventService.deleteEvent(eventDto.id);
  
      jest.spyOn(eventRepository, 'findOne').mockResolvedValue(null);
      const deletedEvent = await eventService.getEventById(eventDto.id);
      expect(deletedEvent).toBeNull();
  
    });
  
});