import { IsEmail, IsOptional, IsString } from 'class-validator';

export class SignInDto {
  @IsOptional()
  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  password: string;
}
