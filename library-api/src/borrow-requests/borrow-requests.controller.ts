
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { BorrowRequestsService } from './borrow-requests.service';
import { CreateBorrowRequestDto } from './dto/create-borrow-request.dto';
import { UpdateBorrowRequestDto } from './dto/update-borrow-request.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('borrow-requests')
@UseGuards(JwtAuthGuard)
export class BorrowRequestsController {
  constructor(private readonly borrowRequestsService: BorrowRequestsService) {}

  // Patron creates a request
  @Post()
  create(@Request() req, @Body() dto: CreateBorrowRequestDto) {
    return this.borrowRequestsService.create(req.user.userId, dto);
  }

  // Patron sees their own requests
  @Get('my')
  findMyRequests(@Request() req) {
    return this.borrowRequestsService.findAllForUser(req.user.userId);
  }

  // Librarian sees all requests
  @Get()
  @UseGuards(RolesGuard)
  @Roles('LIBRARIAN')
  findAll() {
    return this.borrowRequestsService.findAll();
  }

  // Librarian updates status
  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles('LIBRARIAN')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateBorrowRequestDto,
  ) {
    return this.borrowRequestsService.updateStatus(id, dto);
  }
}