
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Req() req: any) {
    // req.user contains { userId, role } from JwtStrategy.validate()
    // The JwtAuthGuard guarantees req.user exists, so we can safely access it
    return this.usersService.getProfile(req.user.userId);
  }
}
