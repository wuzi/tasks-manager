import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export default class UpdateTaskDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @IsOptional()
  public title!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @IsOptional()
  public description!: string;

  @IsString()
  @IsIn(['pending', 'in progress', 'done'])
  @IsOptional()
  public status!: 'pending' | 'in progress' | 'done';
}
