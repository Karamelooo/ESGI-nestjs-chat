import { IsString, MinLength, IsOptional, Matches } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(3)
  username: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsString()
  @Matches(/^#([0-9A-F]{3}){1,2}$/i, { message: 'Color must be a hex code' })
  color?: string;
}
