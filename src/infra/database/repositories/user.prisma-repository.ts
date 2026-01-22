import { Injectable } from '@nestjs/common';
import { User as PrismaUser, Prisma } from '@prisma/client';
import { UserEntity } from '../../../domain/entities';
import { RoleEnum, StepOnboardingEnum } from '../../../domain/enum';
import {
  IUserRepositoryFilter,
  UserRepository,
} from '../../../domain/repositories';
import { PrismaService } from '../prisma/prisma.service';
import { BasePrismaRepository } from './base.prisma-repository';

@Injectable()
export class UserPrismaRepository
  extends BasePrismaRepository<UserEntity, PrismaUser>
  implements UserRepository
{
  constructor(prisma: PrismaService) {
    super(prisma, prisma.user);
  }

  protected toDomain(prismaModel: PrismaUser): UserEntity {
    const user = new UserEntity({});
    user._id = prismaModel.id;
    user.name = prismaModel.name;
    user.email = prismaModel.email;
    user.password = prismaModel.password;
    user.phone = prismaModel.phone;
    user.stepOnboarding = prismaModel.stepOnboarding as StepOnboardingEnum;
    user.role = prismaModel.role as RoleEnum;
    if (prismaModel.companyId) {
      user.companyId = prismaModel.companyId;
    }
    user._createdAt = prismaModel.createdAt;
    user._updatedAt = prismaModel.updatedAt;
    return user;
  }

  protected toPrisma(entity: UserEntity): Record<string, unknown> {
    return {
      id: entity._id,
      name: entity.name,
      email: entity.email,
      password: entity.password,
      phone: entity.phone,
      stepOnboarding: entity.stepOnboarding,
      role: entity.role,
      company: entity.companyId
        ? { connect: { id: entity.companyId } }
        : undefined,
    };
  }

  async findByFilter(filter: IUserRepositoryFilter): Promise<UserEntity[]> {
    const where: Prisma.UserWhereInput = {};

    if (filter.email) where.email = filter.email;
    if (filter.phone) where.phone = filter.phone;
    if (filter.companyId) where.companyId = filter.companyId;
    if (filter.role) where.role = filter.role;
    if (filter.stepOnboarding) where.stepOnboarding = filter.stepOnboarding;

    const results = await this.prisma.user.findMany({ where });
    return results.map((result) => this.toDomain(result));
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const result = await this.prisma.user.findUnique({
      where: { email },
    });

    return result ? this.toDomain(result) : null;
  }
}
