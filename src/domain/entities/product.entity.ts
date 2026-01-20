import { CategoryEnum } from "../enum/category.enum";
import { BaseEntity } from "./base.entity";

export class ProductEntity extends BaseEntity {
    private _name: string;
    private _category: CategoryEnum;
    private _description: string;
    private _price: number;
    private _stock: number;
    private _freeShipping: boolean;
    
    constructor(product: Partial<ProductEntity>) {
        super(product);
        Object.assign(this, product);
    }

    get name(): string {
        return this._name;
    }
    
    get category(): CategoryEnum {
        return this._category;
    }

    get description(): string {
        return this._description;
    }

    get price(): number {
        return this._price;
    }

    get stock(): number {
        return this._stock;
    }

    get freeShipping(): boolean {
        return this._freeShipping;
    }

    set name(name: string) {
        this._name = name;
    }
    
    set category(category: CategoryEnum) {
        this._category = category;
    }

    set description(description: string) {
        this._description = description;
    }
    
    set price(price: number) {
        this._price = price;
    }

    set stock(stock: number) {
        this._stock = stock;
    }

    set freeShipping(freeShipping: boolean) {
        this._freeShipping = freeShipping;
    }
}