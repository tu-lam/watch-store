import { CartItem } from 'src/cart-items/entities/cart-item.entity';
import {
  Column,
  PrimaryGeneratedColumn,
  Entity,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: 'user' })
  role: string;

  @OneToMany(() => CartItem, (cartItem) => cartItem.userId)
  public cartItems: CartItem[];
}
