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

export interface IListProductsInput {
  name?: string;
  category?: CategoryEnum;
  sellerId?: string;
  sellerType?: UserTypeEnum;
  freeShipping?: boolean;
  priceMin?: number;
  priceMax?: number;
  limit?: number;
  offset?: number;
}

export interface IProductOutput {
  id: string;
  name: string;
  category: CategoryEnum;
  description: string;
  price: number;
  stock: number;
  freeShipping: boolean;
  sellerId: string;
  sellerType: UserTypeEnum;
  createdAt: Date;
  updatedAt: Date;
}

export interface IListProductsOutput {
  products: IProductOutput[];
  total: number;
}

export interface IDeleteProductInput {
  id: string;
  sellerId: string;
  sellerType: UserTypeEnum;
}

export interface IDeleteProductOutput {
  success: boolean;
}

export interface ICalculateShippingInput {
  productId: string;
  destinationZipCode: string;
}

export interface ICalculateShippingOutput {
  productId: string;
  originZipCode: string;
  destinationZipCode: string;
  shippingCost: number;
  estimatedDays: number;
}
