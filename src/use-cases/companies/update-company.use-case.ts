import {
  IUpdateCompanyInput,
  IUpdateCompanyOutput,
} from '../../domain/interfaces';
import { CompanyRepository } from '../../domain/repositories';
import { BaseUseCase } from '../base.use-case';

export class UpdateCompanyUseCase extends BaseUseCase<
  IUpdateCompanyInput,
  IUpdateCompanyOutput
> {
  constructor(private readonly companyRepository: CompanyRepository) {
    super();
  }

  async execute(input: IUpdateCompanyInput): Promise<IUpdateCompanyOutput> {
    const company = await this.companyRepository.findById(input.id);

    if (!company) {
      throw new Error('Company not found');
    }

    if (input.corporateName !== undefined) {
      company.corporateName = input.corporateName;
    }

    if (input.cnpj !== undefined) {
      const existingCompanies = await this.companyRepository.findByFilter({
        cnpj: input.cnpj,
      });
      const otherCompanyWithCnpj = existingCompanies.find(
        (c) => c._id !== input.id,
      );

      if (otherCompanyWithCnpj) {
        throw new Error('CNPJ already in use by another company');
      }

      company.cnpj = input.cnpj;
    }

    if (input.phone !== undefined) {
      company.phone = input.phone;
    }

    if (input.email !== undefined) {
      company.email = input.email;
    }

    const updatedCompany = await this.companyRepository.update(company);

    return {
      id: updatedCompany._id,
      corporateName: updatedCompany.corporateName,
      cnpj: updatedCompany.cnpj,
      phone: updatedCompany.phone,
      email: updatedCompany.email,
      updatedAt: updatedCompany._updatedAt,
    };
  }
}
