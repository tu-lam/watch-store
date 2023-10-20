import { Module, ValidationPipe, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { ProductsModule } from './products/products.module';
import * as session from 'express-session';
import { Product } from './products/entities/product.entity';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { CartItemsModule } from './cart-items/cart-items.module';
import { CartItem } from './cart-items/entities/cart-item.entity';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [User, Product, CartItem],
      synchronize: true,
    }),
    MulterModule.register({
      dest: './public',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '../public'),
      serveRoot: '/public/',
    }),
    UsersModule,
    ProductsModule,
    CartItemsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({ whitelist: true }),
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        session({
          secret: 'my-secret',
          resave: false,
          saveUninitialized: false,
          cookie: {
            secure: false,
          },
        }),
      )
      .forRoutes('*');
  }
}
