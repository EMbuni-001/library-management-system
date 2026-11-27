
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBorrowRequestDto } from './dto/create-borrow-request.dto';
import { UpdateBorrowRequestDto } from './dto/update-borrow-request.dto';
import { calculateFine } from './fine-calculator';

@Injectable()
export class BorrowRequestsService {
  constructor(private prisma: PrismaService) {}

  // Patrons can see their own requests
  async findAllForUser(userId: number) {
    return this.prisma.borrowRequest.findMany({
      where: { userId },
      include: { book: true },
      orderBy: { requestDate: 'desc' },
    });
  }

  // Librarians can see all requests
  async findAll() {
    return this.prisma.borrowRequest.findMany({
      include: { user: true, book: true },
      orderBy: { requestDate: 'desc' },
    });
  }

  async create(userId: number, dto: CreateBorrowRequestDto) {
    const book = await this.prisma.book.findUnique({
      where: { id: dto.bookId },
    });

    if (!book) {
      throw new NotFoundException('Book not found');
    }

    // Snapshot the book title and author at the time of the request
    return this.prisma.borrowRequest.create({
      data: {
        userId,
        bookId: dto.bookId,
        bookTitle: book.title,
        bookAuthor: book.author,
      },
      include: { user: true, book: true },
    });
  }

  async updateStatus(id: number, dto: UpdateBorrowRequestDto) {
    const request = await this.prisma.borrowRequest.findUnique({
      where: { id },
    });

    if (!request) {
      throw new NotFoundException('Borrow request not found');
    }

    const updateData: any = { status: dto.status };

    // When approved, set a due date (e.g., 14 days from now)
    if (dto.status === 'APPROVED' && !request.dueDate) {
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 14);
      updateData.dueDate = dueDate;
    }

    // When returned, record the return date and calculate the fine
    if (dto.status === 'RETURNED') {
      updateData.returnDate = new Date();
      if (request.dueDate) {
        updateData.fineAmount = calculateFine(
          request.dueDate,
          updateData.returnDate,
        );
      }
    }

    return this.prisma.borrowRequest.update({
      where: { id },
      data: updateData,
      include: { user: true, book: true },
    });
  }
}