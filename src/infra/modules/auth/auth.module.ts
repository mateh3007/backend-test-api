import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';
import { JwtAuthGuard, RolesGuard } from '../../commons/guards';
import { JwtStrategy } from '../../commons/strategies';
import { UserRepository } from '../../../domain/repositories';
import { UserPrismaRepository } from '../../database/repositories';
import {
  LoginController,
  RegisterController,
} from '../../../presentation/controllers/auth';
import { LoginUseCase, RegisterUseCase } from '../../../use-cases/auth';
import { BcryptModule } from '../bcrypt';
import { JwtModule } from '../jwt';
import { DatabaseModule } from '../database';
import { RedisModule } from '../redis';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    DatabaseModule,
    BcryptModule,
    JwtModule,
    RedisModule,
  ],
  controllers: [LoginController, RegisterController],
  providers: [
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: UserRepository,
      useClass: UserPrismaRepository,
    },
    LoginUseCase,
    RegisterUseCase,
  ],
  exports: [PassportModule],
})
export class AuthModule {}
