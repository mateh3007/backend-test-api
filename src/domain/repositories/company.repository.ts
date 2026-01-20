import { CompanyEntity } from '../entities';
import { BaseRepository } from './base.repository';
import { IAddressRepositoryFilter } from './address.repository';

export interface ICompanyRepositoryFilter {
  corporateName?: string;
  cnpj?: string;
  address?: IAddressRepositoryFilter;
}

export abstract class CompanyRepository extends BaseRepository<CompanyEntity> {
  abstract findByFilter(
    filter: ICompanyRepositoryFilter,
  ): Promise<CompanyEntity[]>;
}
