import { Module } from '@nestjs/common';
import {
  AddressRepository,
  CompanyRepository,
  UserRepository,
} from '../../../domain/repositories';
import {
  AddressPrismaRepository,
  CompanyPrismaRepository,
  UserPrismaRepository,
} from '../../database/repositories';
import {
  RegisterUserController,
  RegisterCompanyController,
  CreateAddressController,
} from '../../../presentation/controllers/onboarding';
import {
  RegisterUserUseCase,
  RegisterCompanyUseCase,
  CreateAddressUseCase,
} from '../../../use-cases/onboarding';
import { BcryptModule } from '../bcrypt';
import { JwtModule } from '../jwt';
import { DatabaseModule } from '../database';

@Module({
  imports: [DatabaseModule, BcryptModule, JwtModule],
  controllers: [
    RegisterUserController,
    RegisterCompanyController,
    CreateAddressController,
  ],
  providers: [
    {
      provide: CompanyRepository,
      useClass: CompanyPrismaRepository,
    },
    {
      provide: UserRepository,
      useClass: UserPrismaRepository,
    },
    {
      provide: AddressRepository,
      useClass: AddressPrismaRepository,
    },
    RegisterUserUseCase,
    RegisterCompanyUseCase,
    CreateAddressUseCase,
  ],
})
export class OnboardingModule {}

