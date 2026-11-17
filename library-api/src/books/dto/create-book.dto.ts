
import { IsString, IsInt, IsOptional, Min } from 'class-validator';

export class CreateBookDto {
  @IsString()
  title: string;

  @IsString()
  author: string;

  @IsString()
  isbn: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  coverImage?: string;

  @IsInt()
  @Min(1)
  totalCopies: number;

  @IsInt()
  @Min(0)
  availableCopies: number;

  @IsInt()
  genreId: number;
}