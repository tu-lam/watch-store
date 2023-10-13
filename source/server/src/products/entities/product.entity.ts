import { IsNumber, IsString } from 'class-validator';
import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @IsString()
  name: string;

  @IsString()
  image: string;

  @IsNumber()
  price: number;
}
