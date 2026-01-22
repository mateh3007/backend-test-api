import { Injectable } from '@nestjs/common';
import { Company as PrismaCompany, Prisma } from '@prisma/client';
import { CompanyEntity } from '../../../domain/entities';
import {
  CompanyRepository,
  ICompanyRepositoryFilter,
} from '../../../domain/repositories';
import { PrismaService } from '../prisma/prisma.service';
import { BasePrismaRepository } from './base.prisma-repository';

@Injectable()
export class CompanyPrismaRepository
  extends BasePrismaRepository<CompanyEntity, PrismaCompany>
  implements CompanyRepository
{
  constructor(prisma: PrismaService) {
    super(prisma, prisma.company);
  }

  protected toDomain(prismaModel: PrismaCompany): CompanyEntity {
    const company = new CompanyEntity({});
    company._id = prismaModel.id;
    company.corporateName = prismaModel.corporateName;
    company.cnpj = prismaModel.cnpj;
    company.phone = prismaModel.phone;
    company.email = prismaModel.email;
    company._createdAt = prismaModel.createdAt;
    company._updatedAt = prismaModel.updatedAt;
    return company;
  }

  protected toPrisma(entity: CompanyEntity): Record<string, unknown> {
    return {
      id: entity._id,
      corporateName: entity.corporateName,
      cnpj: entity.cnpj,
      phone: entity.phone,
      email: entity.email,
    };
  }

  async findByFilter(
    filter: ICompanyRepositoryFilter,
  ): Promise<CompanyEntity[]> {
    const where: Prisma.CompanyWhereInput = {};

    if (filter.corporateName) {
      where.corporateName = {
        contains: filter.corporateName,
        mode: 'insensitive',
      };
    }
    if (filter.cnpj) where.cnpj = filter.cnpj;
    if (filter.email) where.email = filter.email;

    const results = await this.prisma.company.findMany({ where });
    return results.map((result) => this.toDomain(result));
  }

  async findByCnpj(cnpj: string): Promise<CompanyEntity | null> {
    const result = await this.prisma.company.findUnique({
      where: { cnpj },
    });

    return result ? this.toDomain(result) : null;
  }
}
