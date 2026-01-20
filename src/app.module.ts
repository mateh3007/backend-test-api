import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RequestLoggerMiddleware } from './infra/commons/middlewares';
import {
  DatabaseModule,
  BcryptModule,
  JwtModule,
  LoggerModule,
  RedisModule,
  ShippingModule,
  AuthModule,
  UsersModule,
  CompaniesModule,
  AddressesModule,
  ProductsModule,
  OrdersModule,
} from './infra/modules';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    LoggerModule,
    DatabaseModule,
    BcryptModule,
    JwtModule,
    RedisModule,
    ShippingModule,
    AuthModule,
    UsersModule,
    CompaniesModule,
    AddressesModule,
    ProductsModule,
    OrdersModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
