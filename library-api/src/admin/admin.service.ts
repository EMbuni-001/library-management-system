
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    const [
      totalBooks,
      totalUsers,
      totalBorrowRequests,
      pendingRequests,
      approvedRequests,
      returnedRequests,
      overdueRequests,
      totalBookings,
      confirmedBookings,
      upcomingBookings,
      totalFines,
    ] = await Promise.all([
      this.prisma.book.count(),
      this.prisma.user.count(),
      this.prisma.borrowRequest.count(),
      this.prisma.borrowRequest.count({ where: { status: 'REQUESTED' } }),
      this.prisma.borrowRequest.count({ where: { status: 'APPROVED' } }),
      this.prisma.borrowRequest.count({ where: { status: 'RETURNED' } }),
      this.prisma.borrowRequest.count({ where: { status: 'OVERDUE' } }),
      this.prisma.booking.count(),
      this.prisma.booking.count({ where: { status: 'CONFIRMED' } }),
      this.prisma.booking.count({
        where: {
          date: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
          status: 'CONFIRMED',
        },
      }),
      this.prisma.borrowRequest.aggregate({
        _sum: { fineAmount: true },
        where: { fineAmount: { gt: 0 } },
      }),
    ]);

    return {
      books: { total: totalBooks },
      users: { total: totalUsers },
      borrowRequests: {
        total: totalBorrowRequests,
        pending: pendingRequests,
        approved: approvedRequests,
        returned: returnedRequests,
        overdue: overdueRequests,
      },
      bookings: {
        total: totalBookings,
        confirmed: confirmedBookings,
        upcoming: upcomingBookings,
      },
      fines: {
        totalCollected: totalFines._sum.fineAmount || 0,
      },
    };
  }
}