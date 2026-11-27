
import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, dto: CreateBookingDto) {
    // Convert the date string to a Date object for Prisma
    const dateObj = new Date(dto.date + 'T00:00:00Z');

    // Conflict check: Two time ranges overlap when the existing start is 
    // before the new end, AND the existing end is after the new start.
    const conflict = await this.prisma.booking.findFirst({
      where: {
        spaceId: dto.spaceId,
        date: dateObj,
        status: 'CONFIRMED',
        startTime: { lt: dto.endTime },
        endTime: { gt: dto.startTime },
      },
    });

    if (conflict) {
      throw new ConflictException(
        'This space is already booked for that time slot',
      );
    }

    return this.prisma.booking.create({
      data: {
        userId,
        spaceId: dto.spaceId,
        date: dateObj,
        startTime: dto.startTime,
        endTime: dto.endTime,
      },
      include: { space: true, user: true },
    });
  }

  // Librarian can see all bookings
  async findAll() {
    return this.prisma.booking.findMany({
      include: { space: true, user: true },
      orderBy: { date: 'desc' },
    });
  }
}