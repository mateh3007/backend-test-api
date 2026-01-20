import { CompanyEntity } from './company.entity';
import { BaseEntity } from './base.entity';

describe('CompanyEntity', () => {
  describe('constructor', () => {
    it('should create a CompanyEntity instance', () => {
      const company = new CompanyEntity({});

      expect(company).toBeInstanceOf(CompanyEntity);
    });

    it('should create an empty CompanyEntity instance with undefined values', () => {
      const company = new CompanyEntity({});

      expect(company.corporateName).toBeUndefined();
      expect(company.cnpj).toBeUndefined();
      expect(company.phone).toBeUndefined();
      expect(company.email).toBeUndefined();
    });
  });

  describe('inheritance', () => {
    it('should be an instance of BaseEntity', () => {
      const company = new CompanyEntity({});

      expect(company).toBeInstanceOf(BaseEntity);
    });

    it('should inherit BaseEntity fields', () => {
      const now = new Date();
      const companyData = {
        _id: 'company-123',
        _createdAt: now,
        _updatedAt: now,
      };

      const company = new CompanyEntity(companyData);

      expect(company._id).toBe('company-123');
      expect(company._createdAt).toBe(now);
      expect(company._updatedAt).toBe(now);
    });
  });

  describe('getters and setters', () => {
    it('should set and get corporateName correctly', () => {
      const company = new CompanyEntity({});

      company.corporateName = 'Thera Consulting LTDA';

      expect(company.corporateName).toBe('Thera Consulting LTDA');
    });

    it('should set and get cnpj correctly', () => {
      const company = new CompanyEntity({});

      company.cnpj = '12.345.678/0001-99';

      expect(company.cnpj).toBe('12.345.678/0001-99');
    });

    it('should set and get phone correctly', () => {
      const company = new CompanyEntity({});

      company.phone = '11999999999';

      expect(company.phone).toBe('11999999999');
    });

    it('should set and get email correctly', () => {
      const company = new CompanyEntity({});

      company.email = 'contact@company.com';

      expect(company.email).toBe('contact@company.com');
    });
  });

  describe('value updates', () => {
    it('should allow updating corporateName', () => {
      const company = new CompanyEntity({});
      company.corporateName = 'Original Name';

      company.corporateName = 'Updated Name';

      expect(company.corporateName).toBe('Updated Name');
    });

    it('should allow updating cnpj', () => {
      const company = new CompanyEntity({});
      company.cnpj = '11.111.111/0001-11';

      company.cnpj = '22.222.222/0001-22';

      expect(company.cnpj).toBe('22.222.222/0001-22');
    });

    it('should allow updating phone', () => {
      const company = new CompanyEntity({});
      company.phone = '11111111111';

      company.phone = '22222222222';

      expect(company.phone).toBe('22222222222');
    });

    it('should allow updating email', () => {
      const company = new CompanyEntity({});
      company.email = 'old@company.com';

      company.email = 'new@company.com';

      expect(company.email).toBe('new@company.com');
    });
  });
});

