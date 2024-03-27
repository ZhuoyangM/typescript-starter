import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserDto } from './user.dto';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  it('Create, read, delete, read again', async () => {
    const userDto: UserDto = { id: 1, name: 'Alex' };
    const newUser = new User();
    Object.assign(newUser, userDto);
    jest.spyOn(userService, 'mapDtoToEntity').mockResolvedValue(newUser);
    jest.spyOn(userRepository, 'save').mockResolvedValue(undefined);
    await userService.createUser(userDto);
    expect(userService.mapDtoToEntity).toHaveBeenCalledWith(userDto);
    expect(userRepository.save).toHaveBeenCalledWith(newUser);

    const user = new User();
    user.id = 1;
    user.name = 'Alex';
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);
    const foundUser = await userService.findUserById(user.id);
    expect(foundUser).toEqual(user);
    expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id: user.id } });

    jest.spyOn(userRepository, 'delete').mockResolvedValue(undefined);
    await userService.deleteUser(userDto.id);

    jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
    const deletedUser = await userService.findUserById(userDto.id);
    expect(deletedUser).toBeNull();

  });

});
