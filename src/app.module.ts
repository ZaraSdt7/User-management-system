import { Module } from '@nestjs/common';
import { ConfigModule } from './module/config/config.module';


@Module({
  imports: [ConfigModule],
 
})
export class AppModule {}
