
import { Controller, Get, Post, Delete, Param, Body, UseGuards, Request } from '@nestjs/common';
import { ReadingListService } from './reading-list.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('reading-list')
@UseGuards(JwtAuthGuard)
export class ReadingListController {
  constructor(private readingListService: ReadingListService) {}

  @Get()
  findAll(@Request() req: any) {
    return this.readingListService.findAll(req.user.userId);
  }

  @Post()
  addBook(@Request() req: any, @Body() body: { bookId: number }) {
    return this.readingListService.addBook(req.user.userId, body.bookId);
  }

  @Delete(':bookId')
  removeBook(@Request() req: any, @Param('bookId') bookId: string) {
    return this.readingListService.removeBook(req.user.userId, Number(bookId));
  }

  @Delete()
  clearList(@Request() req: any) {
    return this.readingListService.clearList(req.user.userId);
  }
}