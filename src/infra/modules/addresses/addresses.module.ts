import { Module } from '@nestjs/common';
import { AddressRepository } from '../../../domain/repositories';
import { AddressPrismaRepository } from '../../database/repositories';
import { UpdateAddressController } from '../../../presentation/controllers/address';
import { UpdateAddressUseCase } from '../../../use-cases/addresses';
import { DatabaseModule } from '../database';

@Module({
  imports: [DatabaseModule],
  controllers: [UpdateAddressController],
  providers: [
    {
      provide: AddressRepository,
      useClass: AddressPrismaRepository,
    },
    UpdateAddressUseCase,
  ],
  exports: [AddressRepository],
})
export class AddressesModule {}
