import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './module/user/model/user.model';
import { AuthModule } from './module/auth/auth.module';
import { UsersModule } from './module/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
      envFilePath: '.env', 
    }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        dialect: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        models: [User],
        autoLoadModels: true,
        synchronize: true, 
        logging: false,
      }),
    }),
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}
