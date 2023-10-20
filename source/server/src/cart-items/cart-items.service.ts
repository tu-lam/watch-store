import { Injectable } from '@nestjs/common';
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

  update(id: number, updateCartItemDto: UpdateCartItemDto) {
    return `This action updates a #${id} cartItem`;
  }

  remove(id: number) {
    return `This action removes a #${id} cartItem`;
  }
}
