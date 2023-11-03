import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Session,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from 'guards/auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './entities/user.entity';
import session from 'express-session';
import { SignInDto } from './dto/sign-in.dto';
import { JwtService } from '@nestjs/jwt';
import { AddItemToCartDto } from './dto/add-item-to-cart.dto';
import { CartItemsService } from 'src/cart-items/cart-items.service';
import { CreateOrderDto } from 'src/orders/dto/create-order.dto';
import { OrdersService } from 'src/orders/orders.service';
import { ManagerGuard } from 'guards/manager.guard';

@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
    private jwtService: JwtService,
    private cartItemService: CartItemsService,
    private orderService: OrdersService,
  ) {}

  @Get('cart')
  @UseGuards(AuthGuard)
  getCart(@CurrentUser() user: User) {
    const cart = this.cartItemService.findAll({ userId: user.id });
    console.log(cart);
    return cart;
  }

  @Post('/signout')
  signOut(@Session() session: any) {
    session.userId = null;
  }

  @Get('/me')
  @UseGuards(AuthGuard)
  getCurrentUser(@CurrentUser() user: User) {
    return user;
  }

  @Post('/signup')
  async createUser(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signup(
      body.name,
      body.email,
      body.password,
    );

    if (!user) {
      return {
        messageCode: 'signup_fail',
      };
    }

    session.userId = user.id;
    return {
      messageCode: 'signup_success',
      token: await this.jwtService.signAsync({ sub: user.id }),
      data: { user },
    };
  }

  @Post('/signin')
  async signin(@Body() body: SignInDto, @Session() session: any) {
    const user = await this.authService.signin(body.email, body.password);

    if (!user) {
      return {
        messageCode: 'signin_fail',
      };
    }

    session.userId = user.id;

    return {
      messageCode: 'signin_success',
      token: await this.jwtService.signAsync({ sub: user.id }),
      data: { user },
    };
  }

  @Get()
  @UseGuards(ManagerGuard)
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Delete(':id')
  @UseGuards(ManagerGuard)
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @Post('cart')
  @UseGuards(AuthGuard)
  async addItemToCart(
    @Body() addItemToCartDto: AddItemToCartDto,
    @CurrentUser() user: User,
  ) {
    const existedCartItem = await this.cartItemService.findOneWhere({
      userId: user.id,
      productId: addItemToCartDto.productId,
    });
    if (existedCartItem) {
      const updateCartItem = await this.cartItemService.update(
        existedCartItem.id,
        {
          quantity: existedCartItem.quantity + addItemToCartDto.quantity,
        },
      );

      return updateCartItem;
    }
    const cartItem = this.cartItemService.create({
      userId: user.id,
      productId: addItemToCartDto.productId,
      quantity: addItemToCartDto.quantity,
    });
    return cartItem;
  }
  @Patch('cart/:id')
  @UseGuards(AuthGuard)
  async updateQuantityCartItem(
    @Body('quantity') quantity: number,
    @CurrentUser() user: User,
    @Param('id') id: string,
  ) {
    const cartItem = await this.cartItemService.update(+id, { quantity });
    return cartItem;
  }

  @Delete('cart/:id')
  @UseGuards(AuthGuard)
  deleteCartItem(@Param('id') id: string) {
    return this.cartItemService.remove(+id);
  }

  @Post('order')
  @UseGuards(AuthGuard)
  createOrder(
    @Body() createOrderDto: CreateOrderDto,
    @CurrentUser() user: User,
  ) {
    return this.orderService.create(user.id, createOrderDto);
  }
}
