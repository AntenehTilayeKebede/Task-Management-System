import { IsString, IsOptional, IsNumber } from 'class-validator';

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  content: string;

  @IsOptional()
  @IsString()
columnId: string;
}
