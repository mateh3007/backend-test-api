import { CreateCompanyUseCase } from './create-company.use-case';
import { CompanyRepository } from '../../domain/repositories';
import { CompanyEntity } from '../../domain/entities';
import { ICreateCompanyInput } from '../../domain/interfaces';

describe('CreateCompanyUseCase', () => {
  let useCase: CreateCompanyUseCase;
  let companyRepository: jest.Mocked<CompanyRepository>;

  const mockCompanyEntity = (): CompanyEntity => {
    const company = new CompanyEntity({});
    company._id = 'company-123';
    company.corporateName = 'Thera Consulting LTDA';
    company.cnpj = '12.345.678/0001-99';
    company.phone = '11999999999';
    company.email = 'contact@thera.com';
    company._createdAt = new Date('2026-01-01');
    company._updatedAt = new Date('2026-01-01');
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

    useCase = new CreateCompanyUseCase(companyRepository);
  });

  describe('execute', () => {
    it('should create a company successfully', async () => {
      const input: ICreateCompanyInput = {
        corporateName: 'Thera Consulting LTDA',
        cnpj: '12.345.678/0001-99',
        phone: '11999999999',
        email: 'contact@thera.com',
      };

      const createdCompany = mockCompanyEntity();
      companyRepository.findByFilter.mockResolvedValue([]);
      companyRepository.create.mockResolvedValue(createdCompany);

      const result = await useCase.execute(input);

      expect(companyRepository.findByFilter).toHaveBeenCalledWith({
        cnpj: input.cnpj,
      });
      expect(companyRepository.create).toHaveBeenCalled();
      expect(result.id).toBe('company-123');
      expect(result.corporateName).toBe(input.corporateName);
      expect(result.cnpj).toBe(input.cnpj);
      expect(result.createdAt).toEqual(createdCompany._createdAt);
    });

    it('should throw error if CNPJ already exists', async () => {
      const input: ICreateCompanyInput = {
        corporateName: 'New Company LTDA',
        cnpj: '12.345.678/0001-99',
        phone: '11888888888',
        email: 'contact@new.com',
      };

      companyRepository.findByFilter.mockResolvedValue([mockCompanyEntity()]);

      await expect(useCase.execute(input)).rejects.toThrow(
        'Company with this CNPJ already exists',
      );
      expect(companyRepository.create).not.toHaveBeenCalled();
    });
  });
});
