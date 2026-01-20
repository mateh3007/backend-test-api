import { OrderEntity } from '../entities';
import { OrderStatusEnum } from '../enum';
import { BaseRepository } from './base.repository';

export interface IOrderRepositoryFilter {
  status?: OrderStatusEnum;
}

export abstract class OrderRepository extends BaseRepository<OrderEntity> {
  abstract findByFilter(filter: IOrderRepositoryFilter): Promise<OrderEntity[]>;
}
