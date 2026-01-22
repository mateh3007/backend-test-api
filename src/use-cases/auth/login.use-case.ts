import { Injectable, Logger } from '@nestjs/common';
import { BcryptAdapter, CacheAdapter, JwtAdapter } from '../../domain/adapters';
import { RoleEnum, StepOnboardingEnum } from '../../domain/enum';
import { ILoginInput, ILoginOutput } from '../../domain/interfaces';
import { UserRepository } from '../../domain/repositories';
import { BaseUseCase } from '../base.use-case';

const USER_CACHE_TTL = 300;
const USER_CACHE_PREFIX = 'user:email:';

interface ICachedUser {
  id: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  role: string;
  stepOnboarding: string;
  companyId?: string;
}

@Injectable()
export class LoginUseCase extends BaseUseCase<ILoginInput, ILoginOutput> {
  private readonly logger = new Logger(LoginUseCase.name);

  constructor(
    private readonly userRepository: UserRepository,
    private readonly bcryptAdapter: BcryptAdapter,
    private readonly jwtAdapter: JwtAdapter,
    private readonly cacheAdapter: CacheAdapter,
  ) {
    super();
  }

  async execute(input: ILoginInput): Promise<ILoginOutput> {
    const cacheKey = `${USER_CACHE_PREFIX}${input.email}`;
    let cached = await this.cacheAdapter.get<ICachedUser>(cacheKey);

    if (cached?.password) {
      this.logger.log(`✅ Cache HIT - Email: ${input.email}`);
    } else {
      this.logger.log(`❌ Cache MISS - Email: ${input.email}`);

      const users = await this.userRepository.findByFilter({
        email: input.email,
      });

      if (users.length === 0) {
        throw new Error('Invalid credentials');
      }

      const user = users[0];
      cached = {
        id: user._id,
        name: user.name,
        email: user.email,
        password: user.password,
        phone: user.phone,
        role: user.role,
        stepOnboarding: user.stepOnboarding,
        companyId: user.companyId,
      };

      try {
        await this.cacheAdapter.set(cacheKey, cached, USER_CACHE_TTL);
        this.logger.log(`📦 Cache SET - Email: ${input.email}`);
      } catch (error) {
        this.logger.warn(`⚠️ Failed to cache user (non-critical): ${error instanceof Error ? error.message : String(error)}`);
      }
    }

    const isPasswordValid = await this.bcryptAdapter.compare(
      input.password,
      cached.password,
    );

    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    const accessToken = await this.jwtAdapter.sign({
      sub: cached.id,
      email: cached.email,
      role: cached.role,
    });

    this.logger.log(`🔐 Login successful - ${cached.email}`);

    return {
      accessToken,
      user: {
        id: cached.id,
        name: cached.name,
        email: cached.email,
        role: cached.role as RoleEnum,
        stepOnboarding: cached.stepOnboarding as StepOnboardingEnum,
        companyId: cached.companyId,
      },
    };
  }
}
