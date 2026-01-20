import { BaseRepository } from "./base.repository";
import { UserEntity } from "../entities";
import { RoleEnum } from "../enum";
import { StepOnboardingEnum } from "../enum";

export abstract class UserRepository extends BaseRepository<UserEntity> {
    abstract findByEmail(email: string): Promise<UserEntity | null>;
    abstract findByPhone(phone: string): Promise<UserEntity | null>;
    abstract findByCompanyId(companyId: string): Promise<UserEntity[]>;
    abstract findByRole(role: RoleEnum): Promise<UserEntity[]>;
    abstract findByStepOnboarding(stepOnboarding: StepOnboardingEnum): Promise<UserEntity[]>;
}