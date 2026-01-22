import { Module } from '@nestjs/common';
import { CompanyRepository } from '../../../domain/repositories';
import { CompanyPrismaRepository } from '../../database/repositories';
import { UpdateCompanyController } from '../../../presentation/controllers/company';
import { UpdateCompanyUseCase } from '../../../use-cases/companies';
import { DatabaseModule } from '../database';

@Module({
  imports: [DatabaseModule],
  controllers: [UpdateCompanyController],
  providers: [
    {
      provide: CompanyRepository,
      useClass: CompanyPrismaRepository,
    },
    UpdateCompanyUseCase,
  ],
  exports: [CompanyRepository],
})
export class CompaniesModule {}
