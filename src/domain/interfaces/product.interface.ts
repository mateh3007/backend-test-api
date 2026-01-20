import { CategoryEnum } from '../enum/category.enum';
import { UserTypeEnum } from '../enum/user.enum';

export interface ICreateProductInput {
  name: string;
  category: CategoryEnum;
  description: string;
  price: number;
  stock: number;
  freeShipping: boolean;
  sellerId: string;
  sellerType: UserTypeEnum;
}

export interface ICreateProductOutput extends ICreateProductInput{
  id: string;
  createdAt: Date;
}

export interface IUpdateProductInput extends Partial<ICreateProductInput>{
  id: string;
}

export interface IUpdateProductOutput extends IUpdateProductInput{
  updatedAt: Date;
}
