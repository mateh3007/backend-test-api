import { OrderStatusEnum } from '../enum/order-status.enum';
import { UserTypeEnum } from '../enum/user.enum';

export interface ICreateOrderInput {
  productId: string;
  productQuantity: number;
  destinationZipCode: string;
  buyerId: string;
}

export interface ICreateOrderOutput {
  id: string;
  productId: string;
  productQuantity: number;
  shippingCost: number;
  totalPrice: number;
  sellerId: string;
  sellerType: UserTypeEnum;
  buyerId: string;
  createdAt: Date;
}

export interface IUpdateOrderStatusInput {
  id: string;
  status: OrderStatusEnum;
}

export interface IUpdateOrderStatusOutput extends IUpdateOrderStatusInput {
  updatedAt: Date;
}

export interface IListOrdersInput {
  status?: OrderStatusEnum;
  buyerId?: string;
  sellerId?: string;
  sellerType?: UserTypeEnum;
  limit?: number;
  offset?: number;
}

export interface IOrderOutput {
  id: string;
  productId: string;
  productQuantity: number;
  shippingCost: number;
  totalPrice: number;
  status: OrderStatusEnum;
  sellerId: string;
  sellerType: UserTypeEnum;
  buyerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IListOrdersOutput {
  orders: IOrderOutput[];
  total: number;
}
