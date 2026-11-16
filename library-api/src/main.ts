import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // 1. Enable global validation (strips unknown fields and checks rules)
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  
  // 2. Enable CORS so frontend apps can make requests
  app.enableCors();
  
  await app.listen(3000);
  console.log(`Application is running on: http://localhost:3000`);
}
bootstrap();