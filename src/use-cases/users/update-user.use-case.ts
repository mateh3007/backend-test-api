import { IUpdateUserInput, IUpdateUserOutput } from '../../domain/interfaces';
import { UserRepository } from '../../domain/repositories';
import { BaseUseCase } from '../base.use-case';

export class UpdateUserUseCase extends BaseUseCase<
  IUpdateUserInput,
  IUpdateUserOutput
> {
  constructor(private readonly userRepository: UserRepository) {
    super();
  }

  async execute(input: IUpdateUserInput): Promise<IUpdateUserOutput> {
    const user = await this.userRepository.findById(input.id);

    if (!user) {
      throw new Error('User not found');
    }

    if (input.name !== undefined) {
      user.name = input.name;
    }

    if (input.email !== undefined) {
      const existingUsers = await this.userRepository.findByFilter({
        email: input.email,
      });
      const otherUserWithEmail = existingUsers.find((u) => u._id !== input.id);

      if (otherUserWithEmail) {
        throw new Error('Email already in use by another user');
      }

      user.email = input.email;
    }

    if (input.password !== undefined) {
      user.password = input.password;
    }

    if (input.phone !== undefined) {
      user.phone = input.phone;
    }

    if (input.role !== undefined) {
      user.role = input.role;
    }

    if (input.companyId !== undefined) {
      user.companyId = input.companyId;
    }

    const updatedUser = await this.userRepository.update(user);

    return {
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      password: updatedUser.password,
      phone: updatedUser.phone,
      role: updatedUser.role,
      companyId: updatedUser.companyId,
      updatedAt: updatedUser._updatedAt,
    };
  }
}
