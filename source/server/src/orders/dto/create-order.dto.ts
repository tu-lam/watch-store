import { IsNumberString, IsOptional, IsString } from 'class-validator';

export class CreateOrderDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  phone: string;

  @IsOptional()
  @IsNumberString()
  address: number;

  @IsOptional()
  @IsNumberString()
  total: number;

  @IsOptional()
  @IsString()
  status: string;
}
