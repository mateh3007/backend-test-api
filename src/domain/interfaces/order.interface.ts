import { OrderStatusEnum } from '../enum/order-status.enum';
import { UserTypeEnum } from '../enum/user.enum';

export interface ICreateOrderInput {
  productId: string;
  productQuantity: number;
  shippingCost: number;
  sellerId: string;
  sellerType: UserTypeEnum;
  buyerId: string;
}

export interface ICreateOrderOutput extends ICreateOrderInput{
  id: string;
  createdAt: Date;
}

export interface IUpdateOrderStatusInput {
  id: string;
  status: OrderStatusEnum;
}

export interface IUpdateOrderStatusOutput extends IUpdateOrderStatusInput{
  updatedAt: Date;
}
