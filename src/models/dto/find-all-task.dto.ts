import { Transform } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export default class FindAllTaskDto {
  @IsInt()
  @Min(1)
  @IsOptional()
  @Transform((value) => Number(value))
  public page!: number;

  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  @Transform((value) => Number(value))
  public limit!: number;

  @IsString()
  @IsIn(['ASC', 'DESC'])
  @IsOptional()
  public orderById!: 'ASC' | 'DESC';

  @IsString()
  @MaxLength(255)
  @IsOptional()
  public title!: string;

  @IsString()
  @MaxLength(255)
  @IsOptional()
  public description!: string;

  @IsString()
  @IsOptional()
  @IsIn(['pending', 'in progress', 'done'])
  public status!: 'pending' | 'in progress' | 'done';
}
