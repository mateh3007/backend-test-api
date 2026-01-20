import { CreateUserUseCase } from './create-user.use-case';
import { UserRepository } from '../../domain/repositories';
import { UserEntity } from '../../domain/entities';
import { RoleEnum, StepOnboardingEnum } from '../../domain/enum';
import { ICreateUserInput } from '../../domain/interfaces';

describe('CreateUserUseCase', () => {
  let useCase: CreateUserUseCase;
  let userRepository: jest.Mocked<UserRepository>;

  const mockUserEntity = (): UserEntity => {
    const user = new UserEntity({});
    user._id = 'user-123';
    user.name = 'John Doe';
    user.email = 'john@email.com';
    user.password = 'password123';
    user.phone = '11999999999';
    user.role = RoleEnum.USER;
    user.stepOnboarding = StepOnboardingEnum.PROFILE;
    user._createdAt = new Date('2026-01-01');
    user._updatedAt = new Date('2026-01-01');
    return user;
  };

  beforeEach(() => {
    userRepository = {
      findById: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findByFilter: jest.fn(),
    } as jest.Mocked<UserRepository>;

    useCase = new CreateUserUseCase(userRepository);
  });

  describe('execute', () => {
    it('should create a user successfully', async () => {
      const input: ICreateUserInput = {
        name: 'John Doe',
        email: 'john@email.com',
        password: 'password123',
        phone: '11999999999',
        role: RoleEnum.USER,
      };

      const createdUser = mockUserEntity();
      userRepository.findByFilter.mockResolvedValue([]);
      userRepository.create.mockResolvedValue(createdUser);

      const result = await useCase.execute(input);

      expect(userRepository.findByFilter).toHaveBeenCalledWith({ email: input.email });
      expect(userRepository.create).toHaveBeenCalled();
      expect(result.name).toBe(input.name);
      expect(result.email).toBe(input.email);
      expect(result.role).toBe(input.role);
      expect(result.createdAt).toEqual(createdUser._createdAt);
    });

    it('should create a user with companyId', async () => {
      const input: ICreateUserInput = {
        name: 'John Doe',
        email: 'john@email.com',
        password: 'password123',
        phone: '11999999999',
        role: RoleEnum.COMPANY_OWNER,
        companyId: 'company-123',
      };

      const createdUser = mockUserEntity();
      createdUser.companyId = 'company-123';
      createdUser.role = RoleEnum.COMPANY_OWNER;

      userRepository.findByFilter.mockResolvedValue([]);
      userRepository.create.mockResolvedValue(createdUser);

      const result = await useCase.execute(input);

      expect(result.companyId).toBe('company-123');
      expect(result.role).toBe(RoleEnum.COMPANY_OWNER);
    });

    it('should throw error if email already exists', async () => {
      const input: ICreateUserInput = {
        name: 'John Doe',
        email: 'john@email.com',
        password: 'password123',
        phone: '11999999999',
        role: RoleEnum.USER,
      };

      userRepository.findByFilter.mockResolvedValue([mockUserEntity()]);

      await expect(useCase.execute(input)).rejects.toThrow('User with this email already exists');
      expect(userRepository.create).not.toHaveBeenCalled();
    });

    it('should set stepOnboarding to PROFILE by default', async () => {
      const input: ICreateUserInput = {
        name: 'John Doe',
        email: 'john@email.com',
        password: 'password123',
        phone: '11999999999',
        role: RoleEnum.USER,
      };

      userRepository.findByFilter.mockResolvedValue([]);
      userRepository.create.mockImplementation(async (user) => user);

      await useCase.execute(input);

      expect(userRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          _stepOnboarding: StepOnboardingEnum.PROFILE,
        }),
      );
    });
  });
});
