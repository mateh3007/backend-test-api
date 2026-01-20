import { RoleEnum } from '../enum/role.enum';

export interface ICreateUserInput {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: RoleEnum;
  companyId?: string;
}

export interface ICreateUserOutput extends ICreateUserInput {
  createdAt: Date;
}

export interface IUpdateUserInput extends Partial<ICreateUserInput> {
  id: string;
}

export interface IUpdateUserOutput extends IUpdateUserInput {
  updatedAt: Date;
}
