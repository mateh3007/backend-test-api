import { CompanyEntity } from "../../domain/entities";
import { ICreateCompanyInput, ICreateCompanyOutput } from "../../domain/interfaces";
import { CompanyRepository } from "../../domain/repositories";
import { BaseUseCase } from "../base.use-case";


export class CreateCompanyUseCase extends BaseUseCase<ICreateCompanyInput, ICreateCompanyOutput> {
  constructor(private readonly companyRepository: CompanyRepository) {
    super();
  }

  async execute(input: ICreateCompanyInput): Promise<ICreateCompanyOutput> {
    const existingCompanies = await this.companyRepository.findByFilter({ cnpj: input.cnpj });

    if (existingCompanies.length > 0) {
      throw new Error('Company with this CNPJ already exists');
    }

    const company = new CompanyEntity({});
    company.corporateName = input.corporateName;
    company.cnpj = input.cnpj;
    company.phone = input.phone;
    company.email = input.email;

    const createdCompany = await this.companyRepository.create(company);

    return {
      id: createdCompany._id,
      corporateName: createdCompany.corporateName,
      cnpj: createdCompany.cnpj,
      phone: createdCompany.phone,
      email: createdCompany.email,
      createdAt: createdCompany._createdAt,
    };
  }
}

