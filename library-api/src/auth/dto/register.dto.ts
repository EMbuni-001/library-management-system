
import { IsString, IsEmail, IsOptional, IsEnum } from 'class-validator';
import { Role } from '@prisma/client';

export class RegisterDto {
  @IsEmail({}, { message: 'Please provide a valid email' })
  email: string;

  @IsString({ message: 'Password must be a string' })
  password: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsEnum(Role, { message: 'Role must be PATRON or LIBRARIAN' })
  @IsOptional()
  role?: Role;
}