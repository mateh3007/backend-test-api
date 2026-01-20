import { AddressEntity } from '../entities';
import { AddressableEnum } from '../enum';
import { BaseRepository } from './base.repository';

export interface IAddressRepositoryFilter {
  country?: string;
  state?: string;
  city?: string;
  street?: string;
  number?: string;
}

export abstract class AddressRepository extends BaseRepository<AddressEntity> {
  abstract findByAddressableIdAndType(
    addressableId: string,
    addressableType: AddressableEnum,
  ): Promise<AddressEntity | null>;
}
