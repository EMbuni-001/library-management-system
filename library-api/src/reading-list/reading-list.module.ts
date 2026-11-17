
import { Module } from '@nestjs/common';
import { ReadingListService } from './reading-list.service';
import { ReadingListController } from './reading-list.controller';

@Module({
  controllers: [ReadingListController],
  providers: [ReadingListService],
})
export class ReadingListModule {}