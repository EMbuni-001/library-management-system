
import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    // 1. Check if user already exists
    const existingUser = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    // 2. Hash the password securely
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // 3. Create the user in the database
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        name: dto.name,
        role: dto.role || 'PATRON',
      },
    });

    // 4. Return user without the password
    const { password, ...result } = user;
    return result;
  }

  async login(dto: LoginDto) {
    // 1. Find user by email
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 2. Compare provided password with hashed password in DB
    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 3. Generate JWT token
    const payload = { sub: user.id, role: user.role };
    
    return {
      access_token: this.jwtService.sign(payload),
      user: { 
        id: user.id, 
        email: user.email, 
        name: user.name, 
        role: user.role 
      },
    };
  }
}