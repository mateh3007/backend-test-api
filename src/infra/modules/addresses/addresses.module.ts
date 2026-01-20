import { Module } from '@nestjs/common';
import { AddressRepository } from '../../../domain/repositories';
import { AddressPrismaRepository } from '../../database/repositories';
import {
  CreateAddressController,
  UpdateAddressController,
} from '../../../presentation/controllers/address';
import {
  CreateAddressUseCase,
  UpdateAddressUseCase,
} from '../../../use-cases/addresses';

@Module({
  controllers: [CreateAddressController, UpdateAddressController],
  providers: [
    {
      provide: AddressRepository,
      useClass: AddressPrismaRepository,
    },
    CreateAddressUseCase,
    UpdateAddressUseCase,
  ],
  exports: [AddressRepository],
})
export class AddressesModule {}
