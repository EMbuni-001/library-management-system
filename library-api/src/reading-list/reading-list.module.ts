
import { Module } from '@nestjs/common';
import { ReadingListController } from './reading-list.controller';
import { ReadingListService } from './reading-list.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [ReadingListController],
  providers: [ReadingListService, PrismaService],
})
export class ReadingListModule {}