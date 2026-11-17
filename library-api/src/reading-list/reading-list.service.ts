
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReadingListService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: number) {
    return this.prisma.readingListItem.findMany({
      where: { userId },
      include: { book: { include: { genre: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async addBook(userId: number, bookId: number) {
    return this.prisma.readingListItem.create({
      data: { userId, bookId },
      include: { book: { include: { genre: true } } },
    });
  }

  async removeBook(userId: number, bookId: number) {
    return this.prisma.readingListItem.delete({
      where: { userId_bookId: { userId, bookId } },
    });
  }

  async clearList(userId: number) {
    return this.prisma.readingListItem.deleteMany({
      where: { userId },
    });
  }
}