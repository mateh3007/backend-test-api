import { BcryptAdapter, JwtAdapter } from "../../domain/adapters";
import { ILoginInput, ILoginOutput } from "../../domain/interfaces";
import { UserRepository } from "../../domain/repositories";
import { BaseUseCase } from "../base.use-case";

export class LoginUseCase extends BaseUseCase<ILoginInput, ILoginOutput> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly bcryptAdapter: BcryptAdapter,
    private readonly jwtAdapter: JwtAdapter,
  ) {
    super();
  }

  async execute(input: ILoginInput): Promise<ILoginOutput> {
    const users = await this.userRepository.findByFilter({ email: input.email });

    if (users.length === 0) {
      throw new Error('Invalid credentials');
    }

    const user = users[0];

    const isPasswordValid = await this.bcryptAdapter.compare(input.password, user.password);

    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    const accessToken = await this.jwtAdapter.sign({
      sub: user._id,
      email: user.email,
      role: user.role,
    });

    return {
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        stepOnboarding: user.stepOnboarding,
        companyId: user.companyId,
      },
    };
  }
}

