import { IsEmail, IsNumber, IsOptional, IsString } from 'class-validator';

export class AddItemToCartDto {
  @IsOptional()
  @IsNumber()
  productId: number;

  @IsOptional()
  @IsNumber()
  quantity: number;
}
