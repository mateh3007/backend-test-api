import { Module } from '@nestjs/common';
import { UserRepository } from '../../../domain/repositories';
import { UserPrismaRepository } from '../../database/repositories';
import {
  CreateUserController,
  UpdateUserController,
} from '../../../presentation/controllers/user';
import { CreateUserUseCase, UpdateUserUseCase } from '../../../use-cases/users';
import { DatabaseModule } from '../database';

@Module({
  imports: [DatabaseModule],
  controllers: [CreateUserController, UpdateUserController],
  providers: [
    {
      provide: UserRepository,
      useClass: UserPrismaRepository,
    },
    CreateUserUseCase,
    UpdateUserUseCase,
  ],
  exports: [UserRepository],
})
export class UsersModule {}
