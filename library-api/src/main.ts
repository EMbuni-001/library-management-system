
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS so the React frontend (running on port 5173)
  // can make requests to this backend (running on port 3000).
  // Without this, the browser will block every request from the frontend.
  app.enableCors();

  // Apply global validation to all incoming requests.
  // whitelist: true strips any properties not defined in the DTO,
  // preventing unexpected data from reaching your services.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`\n✅ Library API is running on: http://localhost:${port}`);
  console.log(`📚 Frontend should connect from: http://localhost:5173\n`);
}

bootstrap();