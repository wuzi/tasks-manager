import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export default class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  public title!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  public description!: string;

  @IsString()
  @IsOptional()
  @IsIn(['pending', 'in progress', 'done'])
  public status!: 'pending' | 'in progress' | 'done';
}
