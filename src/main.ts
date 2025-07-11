import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { ConfigService } from '@nestjs/config';
import { RequestLoggerMiddleware } from './common/middlewares/request-logger.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  const port = configService.get<number>('server.port');
  const frontendUrl = configService.get<string>('cors.frontendUrl');

  app.enableCors({
    origin: [
      frontendUrl,
      'http://localhost:3000',
      'https://yourdomain.com', // Your production frontend domain
      'https://www.yourdomain.com' // With www
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type', 
      'Authorization', 
      'X-Requested-With', 
      'Accept'
    ],
    credentials: true, // Important for cookies/auth
  });
  
  // Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true
    })
  );

  app.useGlobalFilters(app.get(GlobalExceptionFilter));

  await app.listen(port || 3000);
}
bootstrap();
