import {
  IUpdateAddressInput,
  IUpdateAddressOutput,
} from '../../domain/interfaces';
import { AddressRepository } from '../../domain/repositories';
import { BaseUseCase } from '../base.use-case';

export class UpdateAddressUseCase extends BaseUseCase<
  IUpdateAddressInput,
  IUpdateAddressOutput
> {
  constructor(private readonly addressRepository: AddressRepository) {
    super();
  }

  async execute(input: IUpdateAddressInput): Promise<IUpdateAddressOutput> {
    const address = await this.addressRepository.findById(input.id);

    if (!address) {
      throw new Error('Address not found');
    }

    if (input.country !== undefined) {
      address.country = input.country;
    }

    if (input.state !== undefined) {
      address.state = input.state;
    }

    if (input.city !== undefined) {
      address.city = input.city;
    }

    if (input.street !== undefined) {
      address.street = input.street;
    }

    if (input.number !== undefined) {
      address.number = input.number;
    }

    if (input.complement !== undefined) {
      address.complement = input.complement;
    }

    if (input.zipCode !== undefined) {
      address.zipCode = input.zipCode;
    }

    const updatedAddress = await this.addressRepository.update(address);

    return {
      id: updatedAddress._id,
      country: updatedAddress.country,
      state: updatedAddress.state,
      city: updatedAddress.city,
      street: updatedAddress.street,
      number: updatedAddress.number,
      complement: updatedAddress.complement,
      zipCode: updatedAddress.zipCode,
      addressableId: updatedAddress.addressableId,
      addressableType: updatedAddress.addressableType,
      updatedAt: updatedAddress._updatedAt,
    };
  }
}
