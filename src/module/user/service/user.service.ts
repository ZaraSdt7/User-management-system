import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { UsersRepository } from '../repository/user.repository';
import { CreateUserDto } from '../dto/user-create.dto';
import { UpdateUserDto } from '../dto/user-update.dto';
import { User } from '../model/user.model';


@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private readonly usersRepository: UsersRepository) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const existingUser = await this.usersRepository.findByEmail(createUserDto.email);
      if (existingUser) {
        throw new BadRequestException('This email is already registered.');
      }

      return await this.usersRepository.create(createUserDto);
    } catch (error) {
      this.logger.error('Error creating user', error);
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException('Error creating user');
    }
  }

  async findByEmail(email: string) {
    try {
      return await this.usersRepository.findByEmail(email);
    } catch (error) {
      this.logger.error(`Error finding user by email: ${email}`, error);
      throw new InternalServerErrorException('Error finding user');
    }
  }

  async findById(id: number) {
    try {
      const user = await this.usersRepository.findById(id);
      if (!user) throw new NotFoundException('User not found');
      return user;
    } catch (error) {
      this.logger.error(`Error finding user by id: ${id}`, error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error finding user');
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<UpdateUserDto> {
    try {
      const updatedUser = await this.usersRepository.update(id, updateUserDto);
      if (!updatedUser) throw new NotFoundException('User not found');
      return updatedUser;
    } catch (error) {
      this.logger.error(`Error updating user by id: ${id}`, error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error updating user');
    }
  }

  async remove(id: number): Promise<{ message: string }> {
    try {
      const deleted = await this.usersRepository.remove(id);
      if (!deleted) throw new NotFoundException('User not found');
      return { message: 'User successfully deleted' };
    } catch (error) {
      this.logger.error(`Error removing user by id: ${id}`, error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error removing user');
    }
  }

  async findAll(): Promise<CreateUserDto[]> {
    try {
      return await this.usersRepository.findAll();
    } catch (error) {
      this.logger.error('Error finding all users', error.stack);
      throw new InternalServerErrorException('Error finding all users');
    }
  }
}
