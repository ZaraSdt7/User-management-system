import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './model/user.model';
import { UsersRepository } from './repository/user.repository';
import { UsersController } from './controller/user.controller';
import { UsersService } from './service/user.service';

@Module({
  imports: [
    SequelizeModule.forFeature([User]), 
  ],
  providers: [
    UsersService,
    UsersRepository,
  ],
  controllers: [UsersController],
  exports: [
    UsersService,      
    UsersRepository,   
  ],
})
export class UsersModule {}