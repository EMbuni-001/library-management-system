
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { GenresModule } from './genres/genres.module';
import { BooksModule } from './books/books.module';
import { UsersModule } from './users/users.module';
import { ReadingListModule } from './reading-list/reading-list.module';
import { BorrowRequestsModule } from './borrow-requests/borrow-requests.module';
import { BookingsModule } from './bookings/bookings.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 100,
    }]),
    AuthModule,
    GenresModule,
    BooksModule,
    UsersModule,
    ReadingListModule,
    BorrowRequestsModule,
    BookingsModule,
    AdminModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}