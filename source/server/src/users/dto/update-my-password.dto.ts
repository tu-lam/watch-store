import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateMyPasswordDto {
  @IsOptional()
  @IsString()
  currentPassword: string;

  @IsOptional()
  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  confirmPassword: string;
}
