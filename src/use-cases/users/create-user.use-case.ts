import { UserEntity } from '../../domain/entities';
import { StepOnboardingEnum } from '../../domain/enum';
import { ICreateUserInput, ICreateUserOutput } from '../../domain/interfaces';
import { UserRepository } from '../../domain/repositories';
import { BaseUseCase } from '../base.use-case';

export class CreateUserUseCase extends BaseUseCase<
  ICreateUserInput,
  ICreateUserOutput
> {
  constructor(private readonly userRepository: UserRepository) {
    super();
  }

  async execute(input: ICreateUserInput): Promise<ICreateUserOutput> {
    const existingUsers = await this.userRepository.findByFilter({
      email: input.email,
    });

    if (existingUsers.length > 0) {
      throw new Error('User with this email already exists');
    }

    const user = new UserEntity({});
    user.name = input.name;
    user.email = input.email;
    user.password = input.password;
    user.phone = input.phone;
    user.role = input.role;
    user.stepOnboarding = StepOnboardingEnum.PROFILE;

    if (input.companyId) {
      user.companyId = input.companyId;
    }

    const createdUser = await this.userRepository.create(user);

    return {
      name: createdUser.name,
      email: createdUser.email,
      password: createdUser.password,
      phone: createdUser.phone,
      role: createdUser.role,
      companyId: createdUser.companyId,
      createdAt: createdUser._createdAt,
    };
  }
}
