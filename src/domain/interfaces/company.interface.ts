export interface ICreateCompanyInput {
  corporateName: string;
  cnpj: string;
  phone: string;
  email: string;
}

export interface ICreateCompanyOutput extends ICreateCompanyInput {
  id: string;
  createdAt: Date;
}

export interface IUpdateCompanyInput extends Partial<ICreateCompanyInput> {
  id: string;
}

export interface IUpdateCompanyOutput extends IUpdateCompanyInput {
  updatedAt: Date;
}
