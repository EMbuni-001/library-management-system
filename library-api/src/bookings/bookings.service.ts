
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, dto: CreateBookingDto) {
    const dateObj = new Date(dto.date + 'T00:00:00Z');

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

  async findAll() {
    return this.prisma.booking.findMany({
      include: { space: true, user: true },
      orderBy: { date: 'desc' },
    });
  }

  async findAllForUser(userId: number) {
    return this.prisma.booking.findMany({
      where: { userId },
      include: { space: true },
      orderBy: { date: 'desc' },
    });
  }

  async getStats() {
    const total = await this.prisma.booking.count();
    const confirmed = await this.prisma.booking.count({
      where: { status: 'CONFIRMED' },
    });
    const cancelled = await this.prisma.booking.count({
      where: { status: 'CANCELLED' },
    });
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const upcoming = await this.prisma.booking.count({
      where: {
        date: { gte: today },
        status: 'CONFIRMED',
      },
    });

    return { total, confirmed, cancelled, upcoming };
  }
}