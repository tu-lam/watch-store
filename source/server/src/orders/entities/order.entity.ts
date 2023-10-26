import { OrderItem } from 'src/order-items/entities/order-item.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
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

  @Column()
  total: number;

  @Column({ default: 'pending' })
  status: string;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.orderId)
  public orderItems: OrderItem[];
}
