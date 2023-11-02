import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/products/entities/product.entity';
import { Repository } from 'typeorm';
import { CartItem } from './entities/cart-item.entity';

@Injectable()
export class CartItemsService {
  constructor(@InjectRepository(CartItem) private repo: Repository<CartItem>) {}
  create(createCartItemDto: CreateCartItemDto) {
    const product = this.repo.create(createCartItemDto);
    return this.repo.save(product);
  }

  findAll(query: any = {}) {
    return this.repo.find({ where: query, relations: ['product'] });
  }

  findOne(id: number) {
    if (!id) {
      return null;
    }
    return this.repo.findOne({
      where: { id: id },
    });
  }

  findWhere(query: any = {}) {
    return this.repo.find({ where: query, relations: ['product'] });
  }

  findOneWhere(query: any = {}) {
    return this.repo.findOne({ where: query });
  }

  async update(id: number, updateCartItemDto: UpdateCartItemDto) {
    const cartItem = await this.findOne(id);

    if (!cartItem) {
      throw new NotFoundException({ messageCode: 'cart_item_not_found_err' });
    }

    Object.assign(cartItem, updateCartItemDto);

    return this.repo.save(cartItem);
  }

  async remove(id: number) {
    const cartItem = await this.findOne(id);

    if (!cartItem) {
      throw new NotFoundException({ messageCode: 'cart_item_not_found_err' });
    }

    return this.repo.remove(cartItem);
  }
}
