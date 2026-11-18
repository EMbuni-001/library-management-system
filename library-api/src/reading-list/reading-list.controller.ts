
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ReadingListService } from './reading-list.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

// The JWT payload can expose the member id under different keys
// depending on the strategy. Declaring the shape here keeps
// TypeScript strict mode satisfied without using "any".
interface AuthenticatedRequest {
  user?: {
    userId?: number;
    sub?: number;
    id?: number;
  };
}

function resolveUserId(request: AuthenticatedRequest): number {
  const rawId = request.user?.userId ?? request.user?.sub ?? request.user?.id;

  if (rawId === undefined || rawId === null) {
    throw new UnauthorizedException('No member id found in the token.');
  }

  return Number(rawId);
}

@Controller('reading-list')
@UseGuards(JwtAuthGuard)
export class ReadingListController {
  constructor(private readonly readingListService: ReadingListService) {}

  @Get()
  findAll(@Request() request: AuthenticatedRequest) {
    return this.readingListService.findAll(resolveUserId(request));
  }

  @Post()
  addBook(
    @Request() request: AuthenticatedRequest,
    @Body('bookId', ParseIntPipe) bookId: number,
  ) {
    return this.readingListService.addBook(resolveUserId(request), bookId);
  }

  @Delete(':bookId')
  removeBook(
    @Request() request: AuthenticatedRequest,
    @Param('bookId', ParseIntPipe) bookId: number,
  ) {
    return this.readingListService.removeBook(resolveUserId(request), bookId);
  }

  @Delete()
  clearList(@Request() request: AuthenticatedRequest) {
    return this.readingListService.clearList(resolveUserId(request));
  }
}