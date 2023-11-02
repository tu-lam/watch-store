import { OrderItem } from 'src/order-items/entities/order-item.entity';
import { User } from 'src/users/entities/user.entity';
import {
  BeforeInsert,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  name: string;

  @Column()
  phone: string;

  @Column()
  address: string;

  @Column({ default: 0 })
  total: number;

  @Column({ default: 'pending' })
  status: string;

  @Column({ type: 'datetime', nullable: true })
  createdAt: string;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.orderId)
  public orderItems: OrderItem[];

  @OneToOne(() => User)
  public user: User;
}
