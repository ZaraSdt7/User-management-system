import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { User } from '../model/user.model';
import { CreateUserDto } from '../dto/user-create.dto';


@Injectable()
export class UsersRepository {
  private readonly logger = new Logger(UsersRepository.name);

  async create(userData: CreateUserDto): Promise<User> {
    try {
      const user = await User.create(userData as unknown as User);
      return user;
    } catch (error) {
      this.logger.error('Error creating user', error.stack);
      throw new InternalServerErrorException('Error creating user');
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      return await User.findOne({ where: { email } });
    } catch (error) {
      this.logger.error(`Error finding user by email: ${email}`, error);
      throw new InternalServerErrorException('Error finding user');
    }
  }

  async findById(id: number): Promise<User | null> {
    try {
      return await User.findByPk(id);
    } catch (error) {
      this.logger.error(`Error finding user by id: ${id}`, error);
      throw new InternalServerErrorException('Error finding user');
    }
  }

  async update(id: number, updateData: Partial<User>): Promise<User | null> {
    try {
      const user = await this.findById(id);
      if (!user) return null;
      await user.update(updateData);
      return user;
    } catch (error) {
      this.logger.error(`Error updating user by id: ${id}`, error);
      throw new InternalServerErrorException('Error updating user');
    }
  }

  async remove(id: number): Promise<boolean> {
    try {
      const user = await this.findById(id);
      if (!user) return false;
      await user.destroy();
      return true;
    } catch (error) {
      this.logger.error(`Error removing user by id: ${id}`, error);
      throw new InternalServerErrorException('Error removing user');
    }
  }

  async findAll(): Promise<User[]> {
    try {
      return await User.findAll();
    } catch (error) {
      this.logger.error('Error finding all users', error);
      throw new InternalServerErrorException('Error finding all users');
    }
  }
}