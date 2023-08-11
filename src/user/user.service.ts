import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { UserCreateRequestDto } from './dtos/user.create.request.dto';
import { UserCreateResponseDto } from './dtos/user.create.response.dto';
import { RegisterRequestDto } from '../auth/dtos/register-request.dto';
import { Profile } from '../entities/profile.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findById(id: number): Promise<User> {
    return await this.userRepository.findOne({ where: { id: id } });
  }

  async findByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({ where: { email: email } });
  }

  async isUserExists(email: string): Promise<boolean> {
    const userCount = await this.userRepository.count({
      where: { email: email },
    });
    return userCount > 0;
  }

  async createUser(
    userCreateDto: UserCreateRequestDto,
  ): Promise<UserCreateResponseDto> {
    const user: User = await this.userRepository.create(userCreateDto);
    await this.userRepository.save(user);
    const result: UserCreateResponseDto = new UserCreateResponseDto();
    result.id = user.id;
    result.email = user.email;
    return result;
  }

  async registerUser(registerRequestDto: RegisterRequestDto) {
    if (await this.isUserExists(registerRequestDto.email)) {
      throw new BadRequestException('email already taken');
    }
    const user = new User();
    user.email = registerRequestDto.email;
    user.password = registerRequestDto.password;

    const userProfile = new Profile();
    userProfile.firstName = registerRequestDto.firstName;
    userProfile.lastName = registerRequestDto.lastName;
    user.profile = userProfile;

    return await this.userRepository.save(user);
  }
}
