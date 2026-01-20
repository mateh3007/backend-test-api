import { CreateAddressUseCase } from './create-address.use-case';
import { AddressRepository, UserRepository } from '../../domain/repositories';
import { AddressEntity, UserEntity } from '../../domain/entities';
import {
  AddressableEnum,
  RoleEnum,
  StepOnboardingEnum,
} from '../../domain/enum';
import { ICreateAddressInput } from '../../domain/interfaces';

describe('CreateAddressUseCase', () => {
  let useCase: CreateAddressUseCase;
  let addressRepository: jest.Mocked<AddressRepository>;
  let userRepository: jest.Mocked<UserRepository>;

  const mockAddressEntity = (): AddressEntity => {
    const address = new AddressEntity({});
    address._id = 'address-123';
    address.country = 'Brazil';
    address.state = 'SP';
    address.city = 'São Paulo';
    address.street = 'Av. Paulista';
    address.number = '1000';
    address.zipCode = '01310-100';
    address.addressableId = 'user-123';
    address.addressableType = AddressableEnum.USER;
    address._createdAt = new Date('2026-01-01');
    address._updatedAt = new Date('2026-01-01');
    return address;
  };

  const mockUserEntity = (): UserEntity => {
    const user = new UserEntity({});
    user._id = 'user-123';
    user.name = 'John Doe';
    user.email = 'john@email.com';
    user.role = RoleEnum.USER;
    user.stepOnboarding = StepOnboardingEnum.PROFILE;
    return user;
  };

  beforeEach(() => {
    addressRepository = {
      findById: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findByAddressableIdAndType: jest.fn(),
    } as jest.Mocked<AddressRepository>;

    userRepository = {
      findById: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findByFilter: jest.fn(),
    } as jest.Mocked<UserRepository>;

    useCase = new CreateAddressUseCase(addressRepository, userRepository);
  });

  describe('execute', () => {
    it('should create an address successfully', async () => {
      const input: ICreateAddressInput = {
        country: 'Brazil',
        state: 'SP',
        city: 'São Paulo',
        street: 'Av. Paulista',
        number: '1000',
        zipCode: '01310-100',
        addressableId: 'user-123',
        addressableType: AddressableEnum.USER,
      };

      const createdAddress = mockAddressEntity();
      const user = mockUserEntity();

      addressRepository.findByAddressableIdAndType.mockResolvedValue(null);
      addressRepository.create.mockResolvedValue(createdAddress);
      userRepository.findById.mockResolvedValue(user);
      userRepository.update.mockResolvedValue(user);

      const result = await useCase.execute(input);

      expect(addressRepository.findByAddressableIdAndType).toHaveBeenCalledWith(
        'user-123',
        AddressableEnum.USER,
      );
      expect(addressRepository.create).toHaveBeenCalled();
      expect(result.id).toBe('address-123');
      expect(result.country).toBe(input.country);
      expect(result.city).toBe(input.city);
    });

    it('should create an address with complement', async () => {
      const input: ICreateAddressInput = {
        country: 'Brazil',
        state: 'SP',
        city: 'São Paulo',
        street: 'Av. Paulista',
        number: '1000',
        complement: 'Apt 101',
        zipCode: '01310-100',
        addressableId: 'user-123',
        addressableType: AddressableEnum.USER,
      };

      const createdAddress = mockAddressEntity();
      createdAddress.complement = 'Apt 101';
      const user = mockUserEntity();

      addressRepository.findByAddressableIdAndType.mockResolvedValue(null);
      addressRepository.create.mockResolvedValue(createdAddress);
      userRepository.findById.mockResolvedValue(user);
      userRepository.update.mockResolvedValue(user);

      const result = await useCase.execute(input);

      expect(result.complement).toBe('Apt 101');
    });

    it('should throw error if address already exists for entity', async () => {
      const input: ICreateAddressInput = {
        country: 'Brazil',
        state: 'SP',
        city: 'São Paulo',
        street: 'Av. Paulista',
        number: '1000',
        zipCode: '01310-100',
        addressableId: 'user-123',
        addressableType: AddressableEnum.USER,
      };

      addressRepository.findByAddressableIdAndType.mockResolvedValue(
        mockAddressEntity(),
      );

      await expect(useCase.execute(input)).rejects.toThrow(
        'Address already exists for this entity',
      );
      expect(addressRepository.create).not.toHaveBeenCalled();
    });

    it('should update user stepOnboarding when creating address for user', async () => {
      const input: ICreateAddressInput = {
        country: 'Brazil',
        state: 'SP',
        city: 'São Paulo',
        street: 'Av. Paulista',
        number: '1000',
        zipCode: '01310-100',
        addressableId: 'user-123',
        addressableType: AddressableEnum.USER,
      };

      const createdAddress = mockAddressEntity();
      const user = mockUserEntity();

      addressRepository.findByAddressableIdAndType.mockResolvedValue(null);
      addressRepository.create.mockResolvedValue(createdAddress);
      userRepository.findById.mockResolvedValue(user);
      userRepository.update.mockImplementation(async (u) => {
        expect(u.stepOnboarding).toBe(StepOnboardingEnum.ADDRESS);
        return u;
      });

      await useCase.execute(input);

      expect(userRepository.update).toHaveBeenCalled();
    });

    it('should not update stepOnboarding for company address', async () => {
      const input: ICreateAddressInput = {
        country: 'Brazil',
        state: 'SP',
        city: 'São Paulo',
        street: 'Av. Paulista',
        number: '1000',
        zipCode: '01310-100',
        addressableId: 'company-123',
        addressableType: AddressableEnum.COMPANY,
      };

      const createdAddress = mockAddressEntity();
      createdAddress.addressableId = 'company-123';
      createdAddress.addressableType = AddressableEnum.COMPANY;

      addressRepository.findByAddressableIdAndType.mockResolvedValue(null);
      addressRepository.create.mockResolvedValue(createdAddress);

      await useCase.execute(input);

      expect(userRepository.findById).not.toHaveBeenCalled();
      expect(userRepository.update).not.toHaveBeenCalled();
    });
  });
});
