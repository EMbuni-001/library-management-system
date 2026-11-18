
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // The React dev server runs on a different port, so the browser
  // treats it as another origin. This tells the API to accept those
  // requests instead of the browser blocking them.
  app.enableCors();

  // whitelist strips properties that are not declared in the DTO,
  // and transform converts route and query strings into the types
  // the handler expects (for example "3" into 3).
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`Library API is running on http://localhost:${port}`);
  console.log('Expected frontend origin: http://localhost:5173');
}

bootstrap();