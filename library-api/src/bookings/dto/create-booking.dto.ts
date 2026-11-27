
import { IsInt, IsString, Matches } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBookingDto {
  @IsInt()
  @Type(() => Number)
  spaceId: number;

  @IsString()
  date: string; // Expected format: YYYY-MM-DD

  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'startTime must be in HH:MM format',
  })
  startTime: string;

  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'endTime must be in HH:MM format',
  })
  endTime: string;
}