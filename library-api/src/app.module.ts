
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { GenresModule } from './genres/genres.module';
import { BooksModule } from './books/books.module';
import { UsersModule } from './users/users.module';
import { ReadingListModule } from './reading-list/reading-list.module';

@Module({
  imports: [
    // Configure rate limiting: 100 requests per 60 seconds (global default)
    ThrottlerModule.forRoot([{
      ttl: 60000,  // Time window in milliseconds (60 seconds)
      limit: 100,  // Max requests per time window
    }]),
    AuthModule,
    GenresModule,
    BooksModule,
    UsersModule,
    ReadingListModule, // <-- ADDED: Registers the reading list endpoints
  ],
  providers: [
    // Apply ThrottlerGuard globally to all routes
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}