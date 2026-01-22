import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { RequestLoggerMiddleware } from './infra/commons/middlewares';
import {
  DatabaseModule,
  BcryptModule,
  JwtModule,
  LoggerModule,
  RedisModule,
  ShippingModule,
  HealthModule,
  AuthModule,
  OnboardingModule,
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
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minuto
        limit: 100, // 100 requisições por minuto
      },
    ]),
    LoggerModule,
    DatabaseModule,
    BcryptModule,
    JwtModule,
    RedisModule,
    ShippingModule,
    HealthModule,
    AuthModule,
    OnboardingModule,
    UsersModule,
    CompaniesModule,
    AddressesModule,
    ProductsModule,
    OrdersModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
