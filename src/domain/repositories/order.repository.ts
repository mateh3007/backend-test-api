import { OrderEntity } from '../entities';
import { OrderStatusEnum, UserTypeEnum } from '../enum';
import { BaseRepository } from './base.repository';

export interface IOrderRepositoryFilter {
  status?: OrderStatusEnum;
  buyerId?: string;
  sellerId?: string;
  sellerType?: UserTypeEnum;
  limit?: number;
  offset?: number;
}

export abstract class OrderRepository extends BaseRepository<OrderEntity> {
  abstract findByFilter(filter: IOrderRepositoryFilter): Promise<OrderEntity[]>;
  abstract countByFilter(filter: IOrderRepositoryFilter): Promise<number>;
}
