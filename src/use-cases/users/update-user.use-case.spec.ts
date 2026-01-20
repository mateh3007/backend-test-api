import { UpdateUserUseCase } from './update-user.use-case';
import { UserRepository } from '../../domain/repositories';
import { UserEntity } from '../../domain/entities';
import { RoleEnum, StepOnboardingEnum } from '../../domain/enum';
import { IUpdateUserInput } from '../../domain/interfaces';

describe('UpdateUserUseCase', () => {
  let useCase: UpdateUserUseCase;
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
    user._updatedAt = new Date('2026-01-02');
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

    useCase = new UpdateUserUseCase(userRepository);
  });

  describe('execute', () => {
    it('should update user name successfully', async () => {
      const input: IUpdateUserInput = {
        id: 'user-123',
        name: 'Jane Doe',
      };

      const existingUser = mockUserEntity();
      const updatedUser = mockUserEntity();
      updatedUser.name = 'Jane Doe';

      userRepository.findById.mockResolvedValue(existingUser);
      userRepository.update.mockResolvedValue(updatedUser);

      const result = await useCase.execute(input);

      expect(userRepository.findById).toHaveBeenCalledWith('user-123');
      expect(userRepository.update).toHaveBeenCalled();
      expect(result.name).toBe('Jane Doe');
    });

    it('should update user email successfully when not in use', async () => {
      const input: IUpdateUserInput = {
        id: 'user-123',
        email: 'newemail@email.com',
      };

      const existingUser = mockUserEntity();
      const updatedUser = mockUserEntity();
      updatedUser.email = 'newemail@email.com';

      userRepository.findById.mockResolvedValue(existingUser);
      userRepository.findByFilter.mockResolvedValue([]);
      userRepository.update.mockResolvedValue(updatedUser);

      const result = await useCase.execute(input);

      expect(result.email).toBe('newemail@email.com');
    });

    it('should throw error if user not found', async () => {
      const input: IUpdateUserInput = {
        id: 'non-existent',
        name: 'Jane Doe',
      };

      userRepository.findById.mockResolvedValue(null);

      await expect(useCase.execute(input)).rejects.toThrow('User not found');
      expect(userRepository.update).not.toHaveBeenCalled();
    });

    it('should throw error if email already in use by another user', async () => {
      const input: IUpdateUserInput = {
        id: 'user-123',
        email: 'existing@email.com',
      };

      const existingUser = mockUserEntity();
      const otherUser = mockUserEntity();
      otherUser._id = 'user-456';
      otherUser.email = 'existing@email.com';

      userRepository.findById.mockResolvedValue(existingUser);
      userRepository.findByFilter.mockResolvedValue([otherUser]);

      await expect(useCase.execute(input)).rejects.toThrow(
        'Email already in use by another user',
      );
      expect(userRepository.update).not.toHaveBeenCalled();
    });

    it('should allow updating email to same email (own email)', async () => {
      const input: IUpdateUserInput = {
        id: 'user-123',
        email: 'john@email.com',
      };

      const existingUser = mockUserEntity();

      userRepository.findById.mockResolvedValue(existingUser);
      userRepository.findByFilter.mockResolvedValue([existingUser]);
      userRepository.update.mockResolvedValue(existingUser);

      const result = await useCase.execute(input);

      expect(result.email).toBe('john@email.com');
    });

    it('should update multiple fields at once', async () => {
      const input: IUpdateUserInput = {
        id: 'user-123',
        name: 'Jane Doe',
        phone: '11888888888',
        role: RoleEnum.COMPANY_OWNER,
      };

      const existingUser = mockUserEntity();
      const updatedUser = mockUserEntity();
      updatedUser.name = 'Jane Doe';
      updatedUser.phone = '11888888888';
      updatedUser.role = RoleEnum.COMPANY_OWNER;

      userRepository.findById.mockResolvedValue(existingUser);
      userRepository.update.mockResolvedValue(updatedUser);

      const result = await useCase.execute(input);

      expect(result.name).toBe('Jane Doe');
      expect(result.phone).toBe('11888888888');
      expect(result.role).toBe(RoleEnum.COMPANY_OWNER);
    });
  });
});
