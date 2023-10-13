import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    if (!createProductDto.name) {
      throw new BadRequestException({
        messageCode: 'empty_name_product_err',
      });
    }
    if (!createProductDto.slug) {
      throw new BadRequestException({
        messageCode: 'empty_name_product_err',
      });
    }
    if (!createProductDto.price) {
      throw new BadRequestException({
        messageCode: 'empty_price_product_err',
      });
    }
    const product = await this.productsService.create(createProductDto);
    if (!product) {
      return {
        messageCode: 'add_product_fail',
      };
    }
    return {
      messageCode: 'add_product_success',
      data: {
        product,
      },
    };
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    const product = await this.productsService.update(+id, updateProductDto);
    if (!product) {
      return {
        messageCode: 'edit_product_fail',
      };
    }
    return {
      messageCode: 'edit_product_success',
      data: {
        product,
      },
    };
    // return this.productsService.update(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
