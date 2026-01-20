import { Module } from '@nestjs/common';
import { CompanyRepository } from '../../../domain/repositories';
import { CompanyPrismaRepository } from '../../database/repositories';
import {
  CreateCompanyController,
  UpdateCompanyController,
} from '../../../presentation/controllers/company';
import {
  CreateCompanyUseCase,
  UpdateCompanyUseCase,
} from '../../../use-cases/companies';
import { DatabaseModule } from '../database';

@Module({
  imports: [DatabaseModule],
  controllers: [CreateCompanyController, UpdateCompanyController],
  providers: [
    {
      provide: CompanyRepository,
      useClass: CompanyPrismaRepository,
    },
    CreateCompanyUseCase,
    UpdateCompanyUseCase,
  ],
  exports: [CompanyRepository],
})
export class CompaniesModule {}
