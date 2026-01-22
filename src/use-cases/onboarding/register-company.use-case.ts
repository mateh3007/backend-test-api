import { Injectable } from '@nestjs/common';
import { BcryptAdapter, JwtAdapter } from '../../domain/adapters';
import { CompanyEntity, UserEntity } from '../../domain/entities';
import { RoleEnum, StepOnboardingEnum } from '../../domain/enum';
import { ICreateCompanyInput } from '../../domain/interfaces';
import { CompanyRepository, UserRepository } from '../../domain/repositories';
import { BaseUseCase } from '../base.use-case';

export interface IRegisterCompanyInput {
  // Dados da empresa
  corporateName: string;
  cnpj: string;
  phone: string;
  email: string;
  // Dados do usuário dono
  ownerName: string;
  ownerEmail: string;
  ownerPassword: string;
  ownerPhone: string;
}

export interface IRegisterCompanyOutput {
  company: {
    id: string;
    corporateName: string;
    cnpj: string;
    phone: string;
    email: string;
    createdAt: Date;
  };
  owner: {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: RoleEnum;
    stepOnboarding: StepOnboardingEnum;
  };
  accessToken: string;
}

@Injectable()
export class RegisterCompanyUseCase extends BaseUseCase<
  IRegisterCompanyInput,
  IRegisterCompanyOutput
> {
  constructor(
    private readonly companyRepository: CompanyRepository,
    private readonly userRepository: UserRepository,
    private readonly bcryptAdapter: BcryptAdapter,
    private readonly jwtAdapter: JwtAdapter,
  ) {
    super();
  }

  async execute(input: IRegisterCompanyInput): Promise<IRegisterCompanyOutput> {
    // Verificar se CNPJ já existe
    const existingCompanies = await this.companyRepository.findByFilter({
      cnpj: input.cnpj,
    });

    if (existingCompanies.length > 0) {
      throw new Error('Company with this CNPJ already exists');
    }

    // Verificar se email do dono já existe
    const existingUsers = await this.userRepository.findByFilter({
      email: input.ownerEmail,
    });

    if (existingUsers.length > 0) {
      throw new Error('User with this email already exists');
    }

    // Verificar se email da empresa já existe
    const existingCompanyByEmail = await this.companyRepository.findByFilter({
      email: input.email,
    });

    if (existingCompanyByEmail.length > 0) {
      throw new Error('Company with this email already exists');
    }

    // Criar empresa
    const company = new CompanyEntity({});
    company.corporateName = input.corporateName;
    company.cnpj = input.cnpj;
    company.phone = input.phone;
    company.email = input.email;

    const createdCompany = await this.companyRepository.create(company);

    // Criar usuário dono da empresa
    const hashedPassword = await this.bcryptAdapter.hash(input.ownerPassword);

    const owner = new UserEntity({});
    owner.name = input.ownerName;
    owner.email = input.ownerEmail;
    owner.password = hashedPassword;
    owner.phone = input.ownerPhone;
    owner.role = RoleEnum.COMPANY_OWNER;
    owner.stepOnboarding = StepOnboardingEnum.PROFILE;
    owner.companyId = createdCompany._id;

    const createdOwner = await this.userRepository.create(owner);

    // Gerar token JWT
    const accessToken = await this.jwtAdapter.sign({
      sub: createdOwner._id,
      email: createdOwner.email,
      role: createdOwner.role,
      companyId: createdCompany._id,
    });

    return {
      company: {
        id: createdCompany._id,
        corporateName: createdCompany.corporateName,
        cnpj: createdCompany.cnpj,
        phone: createdCompany.phone,
        email: createdCompany.email,
        createdAt: createdCompany._createdAt,
      },
      owner: {
        id: createdOwner._id,
        name: createdOwner.name,
        email: createdOwner.email,
        phone: createdOwner.phone,
        role: createdOwner.role,
        stepOnboarding: createdOwner.stepOnboarding,
      },
      accessToken,
    };
  }
}

