import { ProductEntity } from "../entities";
import { BaseRepository } from "./base.repository";
import { CategoryEnum, UserTypeEnum } from "../enum";

export interface IProductRepositoryFilter {
    name?: string;
    category?: CategoryEnum;
    sellerId?: string;
    sellerType?: UserTypeEnum;
    freeShipping?: boolean;
    price?: {
        min?: number;
        max?: number;
    };
    stock?: {
        min?: number;
        max?: number;
    };
    createdAt?: {
        min?: Date;
        max?: Date;
    };
    updatedAt?: {
        min?: Date;
        max?: Date;
    };
    sort?: {
        field: keyof ProductEntity;
        order: 'asc' | 'desc';
    };
    limit?: number;
    offset?: number;
}

export abstract class ProductRepository extends BaseRepository<ProductEntity> {
    abstract findByFilter(filter: IProductRepositoryFilter): Promise<ProductEntity[]>;
}