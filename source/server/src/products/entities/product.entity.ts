import { IsNumber, IsString } from 'class-validator';
import { CartItem } from 'src/cart-items/entities/cart-item.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  image: string;

  @Column()
  name: string;

  @Column()
  price: number;

  @OneToMany(() => CartItem, (cartItem) => cartItem.productId)
  public cartItems: CartItem[];
}
