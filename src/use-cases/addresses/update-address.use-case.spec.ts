import { UpdateAddressUseCase } from './update-address.use-case';
import { AddressRepository } from '../../domain/repositories';
import { AddressEntity } from '../../domain/entities';
import { AddressableEnum } from '../../domain/enum';
import { IUpdateAddressInput } from '../../domain/interfaces';

describe('UpdateAddressUseCase', () => {
  let useCase: UpdateAddressUseCase;
  let addressRepository: jest.Mocked<AddressRepository>;

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
    address._updatedAt = new Date('2026-01-02');
    return address;
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

    useCase = new UpdateAddressUseCase(addressRepository);
  });

  describe('execute', () => {
    it('should update address street successfully', async () => {
      const input: IUpdateAddressInput = {
        id: 'address-123',
        street: 'Rua Augusta',
      };

      const existingAddress = mockAddressEntity();
      const updatedAddress = mockAddressEntity();
      updatedAddress.street = 'Rua Augusta';

      addressRepository.findById.mockResolvedValue(existingAddress);
      addressRepository.update.mockResolvedValue(updatedAddress);

      const result = await useCase.execute(input);

      expect(addressRepository.findById).toHaveBeenCalledWith('address-123');
      expect(result.street).toBe('Rua Augusta');
    });

    it('should throw error if address not found', async () => {
      const input: IUpdateAddressInput = {
        id: 'non-existent',
        street: 'Rua Augusta',
      };

      addressRepository.findById.mockResolvedValue(null);

      await expect(useCase.execute(input)).rejects.toThrow('Address not found');
      expect(addressRepository.update).not.toHaveBeenCalled();
    });

    it('should update multiple fields at once', async () => {
      const input: IUpdateAddressInput = {
        id: 'address-123',
        street: 'Rua Augusta',
        number: '500',
        complement: 'Suite 10',
        city: 'Campinas',
      };

      const existingAddress = mockAddressEntity();
      const updatedAddress = mockAddressEntity();
      updatedAddress.street = 'Rua Augusta';
      updatedAddress.number = '500';
      updatedAddress.complement = 'Suite 10';
      updatedAddress.city = 'Campinas';

      addressRepository.findById.mockResolvedValue(existingAddress);
      addressRepository.update.mockResolvedValue(updatedAddress);

      const result = await useCase.execute(input);

      expect(result.street).toBe('Rua Augusta');
      expect(result.number).toBe('500');
      expect(result.complement).toBe('Suite 10');
      expect(result.city).toBe('Campinas');
    });

    it('should update zipCode successfully', async () => {
      const input: IUpdateAddressInput = {
        id: 'address-123',
        zipCode: '01311-200',
      };

      const existingAddress = mockAddressEntity();
      const updatedAddress = mockAddressEntity();
      updatedAddress.zipCode = '01311-200';

      addressRepository.findById.mockResolvedValue(existingAddress);
      addressRepository.update.mockResolvedValue(updatedAddress);

      const result = await useCase.execute(input);

      expect(result.zipCode).toBe('01311-200');
    });
  });
});
