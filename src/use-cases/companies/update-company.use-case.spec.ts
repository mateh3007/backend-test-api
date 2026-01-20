import { UpdateCompanyUseCase } from './update-company.use-case';
import { CompanyRepository } from '../../domain/repositories';
import { CompanyEntity } from '../../domain/entities';
import { IUpdateCompanyInput } from '../../domain/interfaces';

describe('UpdateCompanyUseCase', () => {
  let useCase: UpdateCompanyUseCase;
  let companyRepository: jest.Mocked<CompanyRepository>;

  const mockCompanyEntity = (): CompanyEntity => {
    const company = new CompanyEntity({});
    company._id = 'company-123';
    company.corporateName = 'Thera Consulting LTDA';
    company.cnpj = '12.345.678/0001-99';
    company.phone = '11999999999';
    company.email = 'contact@thera.com';
    company._createdAt = new Date('2026-01-01');
    company._updatedAt = new Date('2026-01-02');
    return company;
  };

  beforeEach(() => {
    companyRepository = {
      findById: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findByFilter: jest.fn(),
    } as jest.Mocked<CompanyRepository>;

    useCase = new UpdateCompanyUseCase(companyRepository);
  });

  describe('execute', () => {
    it('should update company corporateName successfully', async () => {
      const input: IUpdateCompanyInput = {
        id: 'company-123',
        corporateName: 'New Name LTDA',
      };

      const existingCompany = mockCompanyEntity();
      const updatedCompany = mockCompanyEntity();
      updatedCompany.corporateName = 'New Name LTDA';

      companyRepository.findById.mockResolvedValue(existingCompany);
      companyRepository.update.mockResolvedValue(updatedCompany);

      const result = await useCase.execute(input);

      expect(companyRepository.findById).toHaveBeenCalledWith('company-123');
      expect(result.corporateName).toBe('New Name LTDA');
    });

    it('should throw error if company not found', async () => {
      const input: IUpdateCompanyInput = {
        id: 'non-existent',
        corporateName: 'New Name',
      };

      companyRepository.findById.mockResolvedValue(null);

      await expect(useCase.execute(input)).rejects.toThrow('Company not found');
      expect(companyRepository.update).not.toHaveBeenCalled();
    });

    it('should throw error if CNPJ already in use by another company', async () => {
      const input: IUpdateCompanyInput = {
        id: 'company-123',
        cnpj: '99.999.999/0001-99',
      };

      const existingCompany = mockCompanyEntity();
      const otherCompany = mockCompanyEntity();
      otherCompany._id = 'company-456';
      otherCompany.cnpj = '99.999.999/0001-99';

      companyRepository.findById.mockResolvedValue(existingCompany);
      companyRepository.findByFilter.mockResolvedValue([otherCompany]);

      await expect(useCase.execute(input)).rejects.toThrow('CNPJ already in use by another company');
      expect(companyRepository.update).not.toHaveBeenCalled();
    });

    it('should allow updating CNPJ to same CNPJ (own CNPJ)', async () => {
      const input: IUpdateCompanyInput = {
        id: 'company-123',
        cnpj: '12.345.678/0001-99',
      };

      const existingCompany = mockCompanyEntity();

      companyRepository.findById.mockResolvedValue(existingCompany);
      companyRepository.findByFilter.mockResolvedValue([existingCompany]);
      companyRepository.update.mockResolvedValue(existingCompany);

      const result = await useCase.execute(input);

      expect(result.cnpj).toBe('12.345.678/0001-99');
    });

    it('should update multiple fields at once', async () => {
      const input: IUpdateCompanyInput = {
        id: 'company-123',
        corporateName: 'New Name LTDA',
        phone: '11888888888',
        email: 'new@email.com',
      };

      const existingCompany = mockCompanyEntity();
      const updatedCompany = mockCompanyEntity();
      updatedCompany.corporateName = 'New Name LTDA';
      updatedCompany.phone = '11888888888';
      updatedCompany.email = 'new@email.com';

      companyRepository.findById.mockResolvedValue(existingCompany);
      companyRepository.update.mockResolvedValue(updatedCompany);

      const result = await useCase.execute(input);

      expect(result.corporateName).toBe('New Name LTDA');
      expect(result.phone).toBe('11888888888');
      expect(result.email).toBe('new@email.com');
    });
  });
});
