import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import { ResponseInterceptor } from './module/common/interceptors/response.interceptor';
import { HttpExceptionFilter } from './module/common/filters/http-exeption.filter';

async function bootstrap() 
{
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*', // Adjust the origin as needed
    methods: 'GET,PUT,PATCH,POST,DELETE',
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

  const rateLimiter = new RateLimiterMemory({
    points: 100,
    duration: 15 * 60,
    blockDuration: 60 * 15,
  });
    app.use((req, res, next) => {
    rateLimiter.consume(req.ip)
      .then(() => {
        next();
      })
      .catch(() => {
        res.status(429).send('Too Many Requests');
      });
  });
  app.enableCors({
    origin: '*', 
  });
  app.useGlobalInterceptors(new ResponseInterceptor());
app.useGlobalFilters(new HttpExceptionFilter());
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
