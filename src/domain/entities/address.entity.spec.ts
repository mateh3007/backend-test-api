import { AddressEntity } from './address.entity';
import { BaseEntity } from './base.entity';
import { AddressableEnum } from '../enum/addressable.enum';

describe('AddressEntity', () => {
  describe('constructor', () => {
    it('should create an AddressEntity instance', () => {
      const address = new AddressEntity({});

      expect(address).toBeInstanceOf(AddressEntity);
    });

    it('should create an empty AddressEntity instance with undefined values', () => {
      const address = new AddressEntity({});

      expect(address.country).toBeUndefined();
      expect(address.state).toBeUndefined();
      expect(address.city).toBeUndefined();
      expect(address.street).toBeUndefined();
      expect(address.number).toBeUndefined();
      expect(address.complement).toBeUndefined();
      expect(address.zipCode).toBeUndefined();
      expect(address.addressableId).toBeUndefined();
      expect(address.addressableType).toBeUndefined();
    });
  });

  describe('inheritance', () => {
    it('should be an instance of BaseEntity', () => {
      const address = new AddressEntity({});

      expect(address).toBeInstanceOf(BaseEntity);
    });

    it('should inherit BaseEntity fields', () => {
      const now = new Date();
      const addressData = {
        _id: 'address-123',
        _createdAt: now,
        _updatedAt: now,
      };

      const address = new AddressEntity(addressData);

      expect(address._id).toBe('address-123');
      expect(address._createdAt).toBe(now);
      expect(address._updatedAt).toBe(now);
    });
  });

  describe('getters and setters', () => {
    it('should set and get country correctly', () => {
      const address = new AddressEntity({});

      address.country = 'Brazil';

      expect(address.country).toBe('Brazil');
    });

    it('should set and get state correctly', () => {
      const address = new AddressEntity({});

      address.state = 'São Paulo';

      expect(address.state).toBe('São Paulo');
    });

    it('should set and get city correctly', () => {
      const address = new AddressEntity({});

      address.city = 'São Paulo';

      expect(address.city).toBe('São Paulo');
    });

    it('should set and get street correctly', () => {
      const address = new AddressEntity({});

      address.street = 'Av. Paulista';

      expect(address.street).toBe('Av. Paulista');
    });

    it('should set and get number correctly', () => {
      const address = new AddressEntity({});

      address.number = '1000';

      expect(address.number).toBe('1000');
    });

    it('should set and get complement correctly', () => {
      const address = new AddressEntity({});

      address.complement = 'Apt 101';

      expect(address.complement).toBe('Apt 101');
    });

    it('should set and get zipCode correctly', () => {
      const address = new AddressEntity({});

      address.zipCode = '01310-100';

      expect(address.zipCode).toBe('01310-100');
    });

    it('should set and get addressableId correctly', () => {
      const address = new AddressEntity({});

      address.addressableId = 'user-123';

      expect(address.addressableId).toBe('user-123');
    });

    it('should set and get addressableType correctly', () => {
      const address = new AddressEntity({});

      address.addressableType = AddressableEnum.USER;

      expect(address.addressableType).toBe(AddressableEnum.USER);
    });
  });

  describe('enums', () => {
    it('should accept AddressableEnum.COMPANY', () => {
      const address = new AddressEntity({});
      address.addressableType = AddressableEnum.COMPANY;

      expect(address.addressableType).toBe(AddressableEnum.COMPANY);
      expect(address.addressableType).toBe('COMPANY');
    });

    it('should accept AddressableEnum.USER', () => {
      const address = new AddressEntity({});
      address.addressableType = AddressableEnum.USER;

      expect(address.addressableType).toBe(AddressableEnum.USER);
      expect(address.addressableType).toBe('USER');
    });
  });

  describe('optional fields', () => {
    it('should allow complement to be undefined', () => {
      const address = new AddressEntity({});
      address.country = 'Brazil';
      address.state = 'SP';
      address.city = 'São Paulo';
      address.street = 'Av. Paulista';
      address.number = '1000';
      address.zipCode = '01310-100';

      expect(address.complement).toBeUndefined();
      expect(address.country).toBe('Brazil');
    });

    it('should allow setting complement after creation', () => {
      const address = new AddressEntity({});

      expect(address.complement).toBeUndefined();

      address.complement = 'Suite 500';

      expect(address.complement).toBe('Suite 500');
    });
  });

  describe('value updates', () => {
    it('should allow updating all fields', () => {
      const address = new AddressEntity({});
      address.country = 'Brazil';
      address.state = 'SP';
      address.city = 'São Paulo';

      address.country = 'USA';
      address.state = 'CA';
      address.city = 'Los Angeles';

      expect(address.country).toBe('USA');
      expect(address.state).toBe('CA');
      expect(address.city).toBe('Los Angeles');
    });

    it('should allow changing addressableType', () => {
      const address = new AddressEntity({});
      address.addressableType = AddressableEnum.USER;
      address.addressableId = 'user-123';

      address.addressableType = AddressableEnum.COMPANY;
      address.addressableId = 'company-456';

      expect(address.addressableType).toBe(AddressableEnum.COMPANY);
      expect(address.addressableId).toBe('company-456');
    });
  });
});
