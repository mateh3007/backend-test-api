import { LoginUseCase } from './login.use-case';
import { UserRepository } from '../../domain/repositories';
import { BcryptAdapter, JwtAdapter } from '../../domain/adapters';
import { UserEntity } from '../../domain/entities';
import { RoleEnum, StepOnboardingEnum } from '../../domain/enum';

describe('LoginUseCase', () => {
  let loginUseCase: LoginUseCase;
  let mockUserRepository: jest.Mocked<UserRepository>;
  let mockBcryptAdapter: jest.Mocked<BcryptAdapter>;
  let mockJwtAdapter: jest.Mocked<JwtAdapter>;

  const mockUser = (): UserEntity => {
    const user = new UserEntity({});
    user._id = 'user-id-123';
    user.name = 'John Doe';
    user.email = 'john@example.com';
    user.password = 'hashed-password';
    user.phone = '11999999999';
    user.role = RoleEnum.USER;
    user.stepOnboarding = StepOnboardingEnum.PROFILE;
    return user;
  };

  beforeEach(() => {
    mockUserRepository = {
      findByFilter: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<UserRepository>;

    mockBcryptAdapter = {
      hash: jest.fn(),
      compare: jest.fn(),
    } as jest.Mocked<BcryptAdapter>;

    mockJwtAdapter = {
      sign: jest.fn(),
      verify: jest.fn(),
    } as jest.Mocked<JwtAdapter>;

    loginUseCase = new LoginUseCase(
      mockUserRepository,
      mockBcryptAdapter,
      mockJwtAdapter,
    );
  });

  describe('execute', () => {
    it('should login successfully with valid credentials', async () => {
      const user = mockUser();
      const input = { email: 'john@example.com', password: 'password123' };

      mockUserRepository.findByFilter.mockResolvedValue([user]);
      mockBcryptAdapter.compare.mockResolvedValue(true);
      mockJwtAdapter.sign.mockResolvedValue('jwt-token-123');

      const result = await loginUseCase.execute(input);

      expect(mockUserRepository.findByFilter).toHaveBeenCalledWith({
        email: input.email,
      });
      expect(mockBcryptAdapter.compare).toHaveBeenCalledWith(
        input.password,
        user.password,
      );
      expect(mockJwtAdapter.sign).toHaveBeenCalledWith({
        sub: user._id,
        email: user.email,
        role: user.role,
      });
      expect(result).toEqual({
        accessToken: 'jwt-token-123',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          stepOnboarding: user.stepOnboarding,
          companyId: undefined,
        },
      });
    });

    it('should login successfully for user linked to company', async () => {
      const user = mockUser();
      user.companyId = 'company-id-123';
      const input = { email: 'john@example.com', password: 'password123' };

      mockUserRepository.findByFilter.mockResolvedValue([user]);
      mockBcryptAdapter.compare.mockResolvedValue(true);
      mockJwtAdapter.sign.mockResolvedValue('jwt-token-123');

      const result = await loginUseCase.execute(input);

      expect(result.user.companyId).toBe('company-id-123');
    });

    it('should throw error when user not found', async () => {
      const input = {
        email: 'nonexistent@example.com',
        password: 'password123',
      };

      mockUserRepository.findByFilter.mockResolvedValue([]);

      await expect(loginUseCase.execute(input)).rejects.toThrow(
        'Invalid credentials',
      );
      expect(mockBcryptAdapter.compare).not.toHaveBeenCalled();
      expect(mockJwtAdapter.sign).not.toHaveBeenCalled();
    });

    it('should throw error when password is incorrect', async () => {
      const user = mockUser();
      const input = { email: 'john@example.com', password: 'wrong-password' };

      mockUserRepository.findByFilter.mockResolvedValue([user]);
      mockBcryptAdapter.compare.mockResolvedValue(false);

      await expect(loginUseCase.execute(input)).rejects.toThrow(
        'Invalid credentials',
      );
      expect(mockBcryptAdapter.compare).toHaveBeenCalledWith(
        input.password,
        user.password,
      );
      expect(mockJwtAdapter.sign).not.toHaveBeenCalled();
    });

    it('should use the same error message for invalid email and password', async () => {
      const user = mockUser();

      // Test invalid email
      mockUserRepository.findByFilter.mockResolvedValue([]);
      await expect(
        loginUseCase.execute({ email: 'invalid@email.com', password: 'pass' }),
      ).rejects.toThrow('Invalid credentials');

      // Test invalid password
      mockUserRepository.findByFilter.mockResolvedValue([user]);
      mockBcryptAdapter.compare.mockResolvedValue(false);
      await expect(
        loginUseCase.execute({ email: user.email, password: 'wrong' }),
      ).rejects.toThrow('Invalid credentials');
    });

    it('should return correct user data in response', async () => {
      const user = mockUser();
      user.role = RoleEnum.COMPANY_OWNER;
      user.stepOnboarding = StepOnboardingEnum.ADDRESS;
      const input = { email: 'john@example.com', password: 'password123' };

      mockUserRepository.findByFilter.mockResolvedValue([user]);
      mockBcryptAdapter.compare.mockResolvedValue(true);
      mockJwtAdapter.sign.mockResolvedValue('jwt-token-123');

      const result = await loginUseCase.execute(input);

      expect(result.user.role).toBe(RoleEnum.COMPANY_OWNER);
      expect(result.user.stepOnboarding).toBe(StepOnboardingEnum.ADDRESS);
    });
  });
});
