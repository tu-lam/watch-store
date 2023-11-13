import { IsNumber, IsString } from 'class-validator';
import { CartItem } from 'src/cart-items/entities/cart-item.entity';
import { OrderItem } from 'src/order-items/entities/order-item.entity';
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

  @Column({ default: '' })
  description: string;

  @Column({ default: 'active' })
  status: string;

  @OneToMany(() => CartItem, (cartItem) => cartItem.productId)
  public cartItems: CartItem[];

  @OneToMany(() => OrderItem, (orderItem) => orderItem.productId)
  public orderItems: OrderItem[];
}
