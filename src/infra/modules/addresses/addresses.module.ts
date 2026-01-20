import { Module } from '@nestjs/common';
import { AddressRepository, UserRepository } from '../../../domain/repositories';
import {
  AddressPrismaRepository,
  UserPrismaRepository,
} from '../../database/repositories';
import {
  CreateAddressController,
  UpdateAddressController,
} from '../../../presentation/controllers/address';
import {
  CreateAddressUseCase,
  UpdateAddressUseCase,
} from '../../../use-cases/addresses';
import { DatabaseModule } from '../database';

@Module({
  imports: [DatabaseModule],
  controllers: [CreateAddressController, UpdateAddressController],
  providers: [
    {
      provide: AddressRepository,
      useClass: AddressPrismaRepository,
    },
    {
      provide: UserRepository,
      useClass: UserPrismaRepository,
    },
    CreateAddressUseCase,
    UpdateAddressUseCase,
  ],
  exports: [AddressRepository],
})
export class AddressesModule {}
