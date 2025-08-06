import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { RateLimiterMemory } from 'rate-limiter-flexible';

async function bootstrap() 
{
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*', // Adjust the origin as needed
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  app.use(helmet());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.use(
    new RateLimiterMemory({
      points: 100, // limit each IP to 100 requests
      duration: 15 * 60, // per 15 minutes
      blockDuration: 60 * 15, // Block for 15 minutes
    }),
  );
  app.enableCors({
    origin: '*', 
  });

  const config = new DocumentBuilder()
    .setTitle('User Management API')
    .setDescription('API documentation for the user system')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
  });
  console.log('App is running on port 3000');
}

 void bootstrap();
