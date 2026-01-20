import { AddressableEnum } from '../enum/addressable.enum';

export interface ICreateAddressInput {
  country: string;
  state: string;
  city: string;
  street: string;
  number: string;
  complement?: string;
  zipCode: string;
  addressableId: string;
  addressableType: AddressableEnum;
}

export interface ICreateAddressOutput extends ICreateAddressInput{
  id: string;
  createdAt: Date;
}

export interface IUpdateAddressInput extends Partial<ICreateAddressInput>{
  id: string;
}

export interface IUpdateAddressOutput extends IUpdateAddressInput{
  updatedAt: Date;
}
