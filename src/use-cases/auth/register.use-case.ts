import { BcryptAdapter, JwtAdapter } from "../../domain/adapters";
import { UserEntity } from "../../domain/entities";
import { RoleEnum, StepOnboardingEnum } from "../../domain/enum";
import { IRegisterInput, IRegisterOutput } from "../../domain/interfaces";
import { UserRepository } from "../../domain/repositories";
import { BaseUseCase } from "../base.use-case";

export class RegisterUseCase extends BaseUseCase<IRegisterInput, IRegisterOutput> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly bcryptAdapter: BcryptAdapter,
    private readonly jwtAdapter: JwtAdapter,
  ) {
    super();
  }

  async execute(input: IRegisterInput): Promise<IRegisterOutput> {
    const existingUsers = await this.userRepository.findByFilter({ email: input.email });

    if (existingUsers.length > 0) {
      throw new Error('User with this email already exists');
    }

    const hashedPassword = await this.bcryptAdapter.hash(input.password);

    const user = new UserEntity({});
    user.name = input.name;
    user.email = input.email;
    user.password = hashedPassword;
    user.phone = input.phone;
    user.role = RoleEnum.USER;
    user.stepOnboarding = StepOnboardingEnum.PROFILE;

    const createdUser = await this.userRepository.create(user);

    const accessToken = await this.jwtAdapter.sign({
      sub: createdUser._id,
      email: createdUser.email,
      role: createdUser.role,
    });

    return {
      id: createdUser._id,
      name: createdUser.name,
      email: createdUser.email,
      phone: createdUser.phone,
      role: createdUser.role,
      stepOnboarding: createdUser.stepOnboarding,
      accessToken,
    };
  }
}

