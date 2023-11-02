import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateOrderItemDto {
  @IsOptional()
  @IsNumber()
  orderId: number;

  @IsOptional()
  @IsNumber()
  productId: number;

  @IsOptional()
  @IsNumber()
  quantity: number;
}
