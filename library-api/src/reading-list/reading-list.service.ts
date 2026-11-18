
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReadingListService {
  constructor(private prisma: PrismaService) {}

  findAll(userId: number) {
    return this.prisma.readingListItem.findMany({
      where: { userId },
      include: { book: { include: { genre: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async addBook(userId: number, bookId: number) {
    const book = await this.prisma.book.findUnique({ where: { id: bookId } });

    if (!book) {
      throw new NotFoundException(`Book with ID ${bookId} not found`);
    }

    // upsert means "create it, or do nothing if it already exists".
    // This makes adding the same book twice safe instead of throwing
    // a unique-constraint error.
    return this.prisma.readingListItem.upsert({
      where: { userId_bookId: { userId, bookId } },
      update: {},
      create: { userId, bookId },
      include: { book: { include: { genre: true } } },
    });
  }

  removeBook(userId: number, bookId: number) {
    // deleteMany returns a count instead of throwing when the row is
    // already gone, so removing twice is not an error.
    return this.prisma.readingListItem.deleteMany({
      where: { userId, bookId },
    });
  }

  clearList(userId: number) {
    return this.prisma.readingListItem.deleteMany({ where: { userId } });
  }
}