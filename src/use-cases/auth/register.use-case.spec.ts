import { RegisterUseCase } from './register.use-case';
import { UserRepository } from '../../domain/repositories';
import { BcryptAdapter, JwtAdapter } from '../../domain/adapters';
import { UserEntity } from '../../domain/entities';
import { RoleEnum, StepOnboardingEnum } from '../../domain/enum';

describe('RegisterUseCase', () => {
  let registerUseCase: RegisterUseCase;
  let mockUserRepository: jest.Mocked<UserRepository>;
  let mockBcryptAdapter: jest.Mocked<BcryptAdapter>;
  let mockJwtAdapter: jest.Mocked<JwtAdapter>;

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

    registerUseCase = new RegisterUseCase(
      mockUserRepository,
      mockBcryptAdapter,
      mockJwtAdapter,
    );
  });

  describe('execute', () => {
    const validInput = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      phone: '11999999999',
    };

    it('should register a new user successfully', async () => {
      const createdUser = new UserEntity({});
      createdUser._id = 'new-user-id';
      createdUser.name = validInput.name;
      createdUser.email = validInput.email;
      createdUser.password = 'hashed-password';
      createdUser.phone = validInput.phone;
      createdUser.role = RoleEnum.USER;
      createdUser.stepOnboarding = StepOnboardingEnum.PROFILE;

      mockUserRepository.findByFilter.mockResolvedValue([]);
      mockBcryptAdapter.hash.mockResolvedValue('hashed-password');
      mockUserRepository.create.mockResolvedValue(createdUser);
      mockJwtAdapter.sign.mockResolvedValue('jwt-token-123');

      const result = await registerUseCase.execute(validInput);

      expect(mockUserRepository.findByFilter).toHaveBeenCalledWith({
        email: validInput.email,
      });
      expect(mockBcryptAdapter.hash).toHaveBeenCalledWith(validInput.password);
      expect(mockUserRepository.create).toHaveBeenCalled();
      expect(mockJwtAdapter.sign).toHaveBeenCalledWith({
        sub: createdUser._id,
        email: createdUser.email,
        role: createdUser.role,
      });
      expect(result).toEqual({
        id: 'new-user-id',
        name: validInput.name,
        email: validInput.email,
        phone: validInput.phone,
        role: RoleEnum.USER,
        stepOnboarding: StepOnboardingEnum.PROFILE,
        accessToken: 'jwt-token-123',
      });
    });

    it('should hash password before saving', async () => {
      const createdUser = new UserEntity({});
      createdUser._id = 'new-user-id';
      createdUser.name = validInput.name;
      createdUser.email = validInput.email;
      createdUser.password = 'hashed-password';
      createdUser.phone = validInput.phone;
      createdUser.role = RoleEnum.USER;
      createdUser.stepOnboarding = StepOnboardingEnum.PROFILE;

      mockUserRepository.findByFilter.mockResolvedValue([]);
      mockBcryptAdapter.hash.mockResolvedValue('hashed-password');
      mockUserRepository.create.mockResolvedValue(createdUser);
      mockJwtAdapter.sign.mockResolvedValue('jwt-token-123');

      await registerUseCase.execute(validInput);

      expect(mockBcryptAdapter.hash).toHaveBeenCalledWith('password123');
      const createCall = mockUserRepository.create.mock.calls[0][0];
      expect(createCall.password).toBe('hashed-password');
    });

    it('should throw error when email already exists', async () => {
      const existingUser = new UserEntity({});
      existingUser._id = 'existing-user-id';
      existingUser.email = validInput.email;

      mockUserRepository.findByFilter.mockResolvedValue([existingUser]);

      await expect(registerUseCase.execute(validInput)).rejects.toThrow(
        'User with this email already exists',
      );

      expect(mockBcryptAdapter.hash).not.toHaveBeenCalled();
      expect(mockUserRepository.create).not.toHaveBeenCalled();
      expect(mockJwtAdapter.sign).not.toHaveBeenCalled();
    });

    it('should set default role as USER', async () => {
      const createdUser = new UserEntity({});
      createdUser._id = 'new-user-id';
      createdUser.name = validInput.name;
      createdUser.email = validInput.email;
      createdUser.password = 'hashed-password';
      createdUser.phone = validInput.phone;
      createdUser.role = RoleEnum.USER;
      createdUser.stepOnboarding = StepOnboardingEnum.PROFILE;

      mockUserRepository.findByFilter.mockResolvedValue([]);
      mockBcryptAdapter.hash.mockResolvedValue('hashed-password');
      mockUserRepository.create.mockResolvedValue(createdUser);
      mockJwtAdapter.sign.mockResolvedValue('jwt-token-123');

      await registerUseCase.execute(validInput);

      const createCall = mockUserRepository.create.mock.calls[0][0];
      expect(createCall.role).toBe(RoleEnum.USER);
    });

    it('should set default stepOnboarding as PROFILE', async () => {
      const createdUser = new UserEntity({});
      createdUser._id = 'new-user-id';
      createdUser.name = validInput.name;
      createdUser.email = validInput.email;
      createdUser.password = 'hashed-password';
      createdUser.phone = validInput.phone;
      createdUser.role = RoleEnum.USER;
      createdUser.stepOnboarding = StepOnboardingEnum.PROFILE;

      mockUserRepository.findByFilter.mockResolvedValue([]);
      mockBcryptAdapter.hash.mockResolvedValue('hashed-password');
      mockUserRepository.create.mockResolvedValue(createdUser);
      mockJwtAdapter.sign.mockResolvedValue('jwt-token-123');

      await registerUseCase.execute(validInput);

      const createCall = mockUserRepository.create.mock.calls[0][0];
      expect(createCall.stepOnboarding).toBe(StepOnboardingEnum.PROFILE);
    });

    it('should return accessToken after registration', async () => {
      const createdUser = new UserEntity({});
      createdUser._id = 'new-user-id';
      createdUser.name = validInput.name;
      createdUser.email = validInput.email;
      createdUser.password = 'hashed-password';
      createdUser.phone = validInput.phone;
      createdUser.role = RoleEnum.USER;
      createdUser.stepOnboarding = StepOnboardingEnum.PROFILE;

      mockUserRepository.findByFilter.mockResolvedValue([]);
      mockBcryptAdapter.hash.mockResolvedValue('hashed-password');
      mockUserRepository.create.mockResolvedValue(createdUser);
      mockJwtAdapter.sign.mockResolvedValue('generated-jwt-token');

      const result = await registerUseCase.execute(validInput);

      expect(result.accessToken).toBe('generated-jwt-token');
    });

    it('should include user id in JWT payload', async () => {
      const createdUser = new UserEntity({});
      createdUser._id = 'user-123';
      createdUser.name = validInput.name;
      createdUser.email = validInput.email;
      createdUser.password = 'hashed-password';
      createdUser.phone = validInput.phone;
      createdUser.role = RoleEnum.USER;
      createdUser.stepOnboarding = StepOnboardingEnum.PROFILE;

      mockUserRepository.findByFilter.mockResolvedValue([]);
      mockBcryptAdapter.hash.mockResolvedValue('hashed-password');
      mockUserRepository.create.mockResolvedValue(createdUser);
      mockJwtAdapter.sign.mockResolvedValue('jwt-token');

      await registerUseCase.execute(validInput);

      expect(mockJwtAdapter.sign).toHaveBeenCalledWith(
        expect.objectContaining({ sub: 'user-123' }),
      );
    });
  });
});
