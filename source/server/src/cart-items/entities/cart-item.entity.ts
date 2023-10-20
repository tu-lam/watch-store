import { Product } from 'src/products/entities/product.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CartItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  productId: number;

  @Column()
  quantity: number;

  @ManyToOne(() => User, (user) => user.cartItems)
  user: User;

  @ManyToOne(() => Product, (product) => product.cartItems)
  product: Product;
}
