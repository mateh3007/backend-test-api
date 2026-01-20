import { AddressableEnum } from '../enum/addressable.enum';
import { BaseEntity } from './base.entity';

export class AddressEntity extends BaseEntity {
  private _country: string;
  private _state: string;
  private _city: string;
  private _street: string;
  private _number: string;
  private _complement?: string;
  private _zipCode: string;
  private _addressableId: string;
  private _addressableType: AddressableEnum;

  constructor(address: Partial<AddressEntity>) {
    super(address);
    Object.assign(this, address);
  }

  get country(): string {
    return this._country;
  }

  get state(): string {
    return this._state;
  }

  get city(): string {
    return this._city;
  }

  get street(): string {
    return this._street;
  }

  get number(): string {
    return this._number;
  }

  get complement(): string | undefined {
    return this._complement;
  }

  get zipCode(): string {
    return this._zipCode;
  }

  get addressableId(): string {
    return this._addressableId;
  }

  get addressableType(): AddressableEnum {
    return this._addressableType;
  }

  set country(country: string) {
    this._country = country;
  }

  set state(state: string) {
    this._state = state;
  }

  set city(city: string) {
    this._city = city;
  }

  set street(street: string) {
    this._street = street;
  }

  set number(number: string) {
    this._number = number;
  }

  set complement(complement: string) {
    this._complement = complement;
  }

  set zipCode(zipCode: string) {
    this._zipCode = zipCode;
  }

  set addressableId(addressableId: string) {
    this._addressableId = addressableId;
  }

  set addressableType(addressableType: AddressableEnum) {
    this._addressableType = addressableType;
  }
}
