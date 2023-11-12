import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartItemsService } from 'src/cart-items/cart-items.service';
import { OrderItemsService } from 'src/order-items/order-items.service';
import { OrderItem } from 'src/order-items/entities/order-item.entity';
import { ProductsService } from 'src/products/products.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private repo: Repository<Order>,
    private cartItemsService: CartItemsService,
    private orderItemsService: OrderItemsService,
    private productsService: ProductsService,
  ) {}
  async create(userId: number, createOrderDto: CreateOrderDto) {
    const order = await this.repo.save({ userId, ...createOrderDto });

    const cartItems = await this.cartItemsService.findWhere({ userId });
    console.log(cartItems);
    if (!cartItems || cartItems.length == 0) {
      throw new BadRequestException({
        messageCode: 'empty_cart_err',
      });
    }

    const orderItems = [];
    for (const cartItem of cartItems) {
      const orderItem = await this.orderItemsService.create({
        productId: cartItem.productId,
        orderId: order.id,
        quantity: cartItem.quantity,
      });

      orderItems.push(orderItem);
    }

    for (const cartItem of cartItems) {
      await this.cartItemsService.remove(cartItem.id);
    }

    order.total = cartItems.reduce((acc, cur) => {
      return acc + cur.product.price * cur.quantity;
    }, 0);

    order.createdAt = new Date().toISOString();
    return this.repo.save(order);
  }

  findAll() {
    return this.repo.find({
      order: {
        id: 'DESC',
      },
    });
  }

  findWhere(query: any = {}) {
    return this.repo.find({ where: query });
  }

  findOne(id: number) {
    if (!id) {
      return null;
    }
    return this.repo.findOne({
      where: { id: id },
    });
  }

  async findOneRelation(id: number) {
    if (!id) {
      return null;
    }
    const order = await this.repo.findOne({
      where: { id: id },
    });

    const orderItems = await this.orderItemsService.findWhere({
      orderId: order.id,
    });

    order.orderItems = orderItems;
    return order;
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    const order = await this.findOne(id);

    if (!order) {
      throw new NotFoundException({ messageCode: 'order_not_found_err' });
    }

    Object.assign(order, updateOrderDto);

    return this.repo.save(order);
  }

  async remove(id: number) {
    const order = await this.findOne(id);

    if (!order) {
      throw new NotFoundException({ messageCode: 'order_not_found_err' });
    }

    return this.repo.remove(order);
  }
}
