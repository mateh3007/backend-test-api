import { AddressEntity } from "../../domain/entities";
import { AddressableEnum, StepOnboardingEnum } from "../../domain/enum";
import { ICreateAddressInput, ICreateAddressOutput } from "../../domain/interfaces";
import { AddressRepository, UserRepository } from "../../domain/repositories";
import { BaseUseCase } from "../base.use-case";

export class CreateAddressUseCase extends BaseUseCase<ICreateAddressInput, ICreateAddressOutput> {
  constructor(
    private readonly addressRepository: AddressRepository,
    private readonly userRepository: UserRepository,
  ) {
    super();
  }

  async execute(input: ICreateAddressInput): Promise<ICreateAddressOutput> {
    const existingAddress = await this.addressRepository.findByAddressableIdAndType(
      input.addressableId,
      input.addressableType,
    );

    if (existingAddress) {
      throw new Error('Address already exists for this entity');
    }

    const address = new AddressEntity({});
    address.country = input.country;
    address.state = input.state;
    address.city = input.city;
    address.street = input.street;
    address.number = input.number;
    address.zipCode = input.zipCode;
    address.addressableId = input.addressableId;
    address.addressableType = input.addressableType;

    if (input.complement) {
      address.complement = input.complement;
    }

    const createdAddress = await this.addressRepository.create(address);

    if (input.addressableType === AddressableEnum.USER) {
      const user = await this.userRepository.findById(input.addressableId);
      if (user && user.stepOnboarding === StepOnboardingEnum.PROFILE) {
        user.stepOnboarding = StepOnboardingEnum.ADDRESS;
        await this.userRepository.update(user);
      }
    }

    return {
      id: createdAddress._id,
      country: createdAddress.country,
      state: createdAddress.state,
      city: createdAddress.city,
      street: createdAddress.street,
      number: createdAddress.number,
      complement: createdAddress.complement,
      zipCode: createdAddress.zipCode,
      addressableId: createdAddress.addressableId,
      addressableType: createdAddress.addressableType,
      createdAt: createdAddress._createdAt,
    };
  }
}

