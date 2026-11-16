
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BooksService {
  constructor(private prisma: PrismaService) {}

  async findAll(genreId?: string, search?: string, page?: string, limit?: string) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};
    if (genreId) where.genreId = parseInt(genreId, 10);
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { author: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [books, total] = await Promise.all([
      this.prisma.book.findMany({ where, skip, take: limitNum, include: { genre: true } }),
      this.prisma.book.count({ where }),
    ]);

    return {
      data: books,
      meta: { total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) },
    };
  }

  async findOne(id: number) {
    const book = await this.prisma.book.findUnique({ where: { id }, include: { genre: true, reviews: true } });
    if (!book) throw new NotFoundException(`Book with ID ${id} not found`);
    return book;
  }

  create(dto: CreateBookDto) { return this.prisma.book.create({ data: dto }); }
  async update(id: number, dto: UpdateBookDto) { await this.findOne(id); return this.prisma.book.update({ where: { id }, data: dto }); }
  async remove(id: number) { await this.findOne(id); return this.prisma.book.delete({ where: { id } }); }
}