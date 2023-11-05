import { PartialType } from '@nestjs/swagger';
import { CreateOrderDto } from './create-order.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {}
// export class UpdateOrderDto {
//   @IsOptional()
//   @IsString()
//   status: string;
// }
