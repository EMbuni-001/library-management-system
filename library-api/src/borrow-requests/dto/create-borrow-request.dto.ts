
import { IsInt } from 'class-validator';

export class CreateBorrowRequestDto {
  @IsInt()
  bookId: number;
}