import { UserEntity } from './user.entity';
import { BaseEntity } from './base.entity';
import { RoleEnum } from '../enum/role.enum';
import { StepOnboardingEnum } from '../enum/step-onboarding.enum';

describe('UserEntity', () => {
  describe('constructor', () => {
    it('should create a UserEntity instance', () => {
      const user = new UserEntity({});

      expect(user).toBeInstanceOf(UserEntity);
    });

    it('should create an empty UserEntity instance with undefined values', () => {
      const user = new UserEntity({});

      expect(user.name).toBeUndefined();
      expect(user.email).toBeUndefined();
      expect(user.password).toBeUndefined();
      expect(user.phone).toBeUndefined();
      expect(user.stepOnboarding).toBeUndefined();
      expect(user.role).toBeUndefined();
      expect(user.companyId).toBeUndefined();
    });
  });

  describe('inheritance', () => {
    it('should be an instance of BaseEntity', () => {
      const user = new UserEntity({});

      expect(user).toBeInstanceOf(BaseEntity);
    });

    it('should inherit BaseEntity fields', () => {
      const now = new Date();
      const userData = {
        _id: 'user-123',
        _createdAt: now,
        _updatedAt: now,
      };

      const user = new UserEntity(userData);

      expect(user._id).toBe('user-123');
      expect(user._createdAt).toBe(now);
      expect(user._updatedAt).toBe(now);
    });
  });

  describe('getters and setters', () => {
    it('should set and get name correctly', () => {
      const user = new UserEntity({});

      user.name = 'John Doe';

      expect(user.name).toBe('John Doe');
    });

    it('should set and get email correctly', () => {
      const user = new UserEntity({});

      user.email = 'john@email.com';

      expect(user.email).toBe('john@email.com');
    });

    it('should set and get password correctly', () => {
      const user = new UserEntity({});

      user.password = 'password123';

      expect(user.password).toBe('password123');
    });

    it('should set and get phone correctly', () => {
      const user = new UserEntity({});

      user.phone = '11999999999';

      expect(user.phone).toBe('11999999999');
    });

    it('should set and get stepOnboarding correctly', () => {
      const user = new UserEntity({});

      user.stepOnboarding = StepOnboardingEnum.PROFILE;

      expect(user.stepOnboarding).toBe(StepOnboardingEnum.PROFILE);
    });

    it('should set and get role correctly', () => {
      const user = new UserEntity({});

      user.role = RoleEnum.USER;

      expect(user.role).toBe(RoleEnum.USER);
    });

    it('should set and get companyId correctly', () => {
      const user = new UserEntity({});

      user.companyId = 'company-123';

      expect(user.companyId).toBe('company-123');
    });
  });

  describe('enums', () => {
    it('should accept RoleEnum.COMPANY_OWNER', () => {
      const user = new UserEntity({});
      user.role = RoleEnum.COMPANY_OWNER;

      expect(user.role).toBe(RoleEnum.COMPANY_OWNER);
      expect(user.role).toBe('COMPANY_OWNER');
    });

    it('should accept RoleEnum.USER', () => {
      const user = new UserEntity({});
      user.role = RoleEnum.USER;

      expect(user.role).toBe(RoleEnum.USER);
      expect(user.role).toBe('USER');
    });

    it('should accept StepOnboardingEnum.PROFILE', () => {
      const user = new UserEntity({});
      user.stepOnboarding = StepOnboardingEnum.PROFILE;

      expect(user.stepOnboarding).toBe(StepOnboardingEnum.PROFILE);
      expect(user.stepOnboarding).toBe('PROFILE');
    });

    it('should accept StepOnboardingEnum.ADDRESS', () => {
      const user = new UserEntity({});
      user.stepOnboarding = StepOnboardingEnum.ADDRESS;

      expect(user.stepOnboarding).toBe(StepOnboardingEnum.ADDRESS);
      expect(user.stepOnboarding).toBe('ADDRESS');
    });
  });

  describe('belongsToCompany', () => {
    it('should return true when user has a companyId', () => {
      const user = new UserEntity({});
      user.linkToCompany('company-123');

      expect(user.belongsToCompany()).toBe(true);
    });

    it('should return false when user has no companyId', () => {
      const user = new UserEntity({});

      expect(user.belongsToCompany()).toBe(false);
    });

    it('should return true when companyId is set via setter', () => {
      const user = new UserEntity({});
      user.companyId = 'company-456';

      expect(user.belongsToCompany()).toBe(true);
    });
  });

  describe('linkToCompany', () => {
    it('should link user to a company', () => {
      const user = new UserEntity({});

      user.linkToCompany('company-456');

      expect(user.companyId).toBe('company-456');
      expect(user.belongsToCompany()).toBe(true);
    });

    it('should update companyId when user is already linked to another company', () => {
      const user = new UserEntity({});
      user.linkToCompany('company-old');

      user.linkToCompany('company-new');

      expect(user.companyId).toBe('company-new');
    });
  });
});
