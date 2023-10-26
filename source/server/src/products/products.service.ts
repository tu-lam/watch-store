import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProductsService {
  constructor(@InjectRepository(Product) private repo: Repository<Product>) {}

  create(createProductDto: CreateProductDto) {
    const product = this.repo.create(createProductDto);
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

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.findOne(id);
    console.log(product);
    if (!product) {
      throw new NotFoundException({ messageCode: 'product_not_found_err' });
    }
    console.log(updateProductDto);
    Object.assign(product, updateProductDto);

    return this.repo.save(product);
  }

  async remove(id: number) {
    const product = await this.findOne(id);

    if (!product) {
      throw new NotFoundException({ messageCode: 'product_not_found_err' });
    }

    return this.repo.remove(product);
  }
}
