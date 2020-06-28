import {
  IsIn,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';

export default class UpdateTaskDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  public title!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  public description!: string;

  @IsString()
  @IsIn(['pending', 'in progress', 'done'])
  public status!: 'pending' | 'in progress' | 'done';
}
