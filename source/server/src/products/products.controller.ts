import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  UseInterceptors,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import { EmployeeOrManagerGuard } from 'guards/empolyee-or-manager.guard';
import { AuthGuard } from 'guards/auth.guard';
import { ManagerGuard } from 'guards/manager.guard';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(AuthGuard)
  @UseGuards(EmployeeOrManagerGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './public/products',
        filename: (_, file, callback) => {
          const ext = file.mimetype.split('/')[1];
          const filename = `product-${Date.now()}.${ext}`;
          callback(null, filename);
        },
      }),
    }),
  )
  async create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException({
        messageCode: 'empty_image_product_err',
      });
    }
    const filePath = path.join('public', 'products', file.filename);
    if (file.size > 5242880) {
      fs.unlinkSync(filePath);
      throw new BadRequestException({
        messageCode: 'invalid_file_size_product_err',
      });
    }

    if (
      !file.originalname.match(/\.(jpg|jpeg|png|gif)$/) ||
      !file.mimetype.startsWith('image/')
    ) {
      fs.unlinkSync(filePath);
      throw new BadRequestException({
        messageCode: 'invalid_file_product_err',
      });
    }
    if (!createProductDto.name) {
      throw new BadRequestException({
        messageCode: 'empty_name_product_err',
      });
    }

    if (!createProductDto.price) {
      throw new BadRequestException({
        messageCode: 'empty_price_product_err',
      });
    }
    createProductDto.image = file.filename;
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
  async findOne(@Param('id') id: string) {
    const product = await this.productsService.findOne(+id);
    return {
      messageCode: 'find_product_success',
      data: {
        product: product,
      },
    };
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @UseGuards(EmployeeOrManagerGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './public/products',
        filename: (_, file, callback) => {
          const ext = file.mimetype.split('/')[1];
          const filename = `product-${Date.now()}.${ext}`;
          callback(null, filename);
        },
      }),
    }),
  )
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    console.log(file);
    if (file) {
      const filePath = path.join('public', 'products', file.filename);
      if (file.size > 5242880) {
        fs.unlinkSync(filePath);
        throw new BadRequestException({
          messageCode: 'invalid_file_size_product_err',
        });
      }

      if (
        !file.originalname.match(/\.(jpg|jpeg|png|gif)$/) ||
        !file.mimetype.startsWith('image/')
      ) {
        fs.unlinkSync(filePath);
        throw new BadRequestException({
          messageCode: 'invalid_file_product_err',
        });
      }
    }
    // if (file && file.size > 5242880) {
    //   throw new BadRequestException({
    //     messageCode: 'invalid_file_size_product_err',
    //   });
    // }

    const oldProduct = await this.productsService.findOne(+id);
    if (file) updateProductDto.image = file.filename;
    const product = await this.productsService.update(+id, updateProductDto);
    if (!product) {
      return {
        messageCode: 'edit_product_fail',
      };
    }
    const filePath = path.join('public', 'products', oldProduct.image);
    if (file) fs.unlinkSync(filePath);
    return {
      messageCode: 'edit_product_success',
      data: {
        product,
      },
    };
    // return this.productsService.update(+id, updateProductDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @UseGuards(ManagerGuard)
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
