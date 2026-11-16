
import { IsString } from 'class-validator';
export class CreateGenreDto {
  @IsString({ message: 'Genre name must be a string' })
  name: string;
}