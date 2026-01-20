import { BaseRepository } from './base.repository';
import { UserEntity } from '../entities';
import { RoleEnum } from '../enum';
import { StepOnboardingEnum } from '../enum';

export interface IUserRepositoryFilter {
  email?: string;
  phone?: string;
  companyId?: string;
  role?: RoleEnum;
  stepOnboarding?: StepOnboardingEnum;
}

export abstract class UserRepository extends BaseRepository<UserEntity> {
  abstract findByFilter(filter?: IUserRepositoryFilter): Promise<UserEntity[]>;
}
