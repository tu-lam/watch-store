import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderItem } from './entities/order-item.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OrderItemsService {
  constructor(
    @InjectRepository(OrderItem) private repo: Repository<OrderItem>,
  ) {}

  findWhere(query: any = {}) {
    return this.repo.find({ where: query });
  }

  create(createOrderItemDto: CreateOrderItemDto) {
    const orderItem = this.repo.create(createOrderItemDto);
    return this.repo.save(orderItem);
  }

  findAll() {
    return this.repo.find();
  }

  findOne(id: number) {
    if (!id) {
      return null;
    }
    return this.repo.findOne({
      where: { id: id },
    });
  }

  async update(id: number, updateOrderItemDto: UpdateOrderItemDto) {
    const orderItem = await this.findOne(id);

    if (!orderItem) {
      throw new NotFoundException({ messageCode: 'order_item_not_found_err' });
    }

    Object.assign(orderItem, updateOrderItemDto);

    return this.repo.save(orderItem);
  }

  async remove(id: number) {
    const orderItem = await this.findOne(id);

    if (!orderItem) {
      throw new NotFoundException({ messageCode: 'order_item_not_found_err' });
    }

    return this.repo.remove(orderItem);
  }
}
