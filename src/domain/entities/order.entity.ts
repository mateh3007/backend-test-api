import { OrderStatusEnum } from "../enum/order-status.enum";
import { BaseEntity } from "./base.entity";
import { UserTypeEnum } from "../enum/user.enum";

export class OrderEntity extends BaseEntity {
    private _productId: string;
    private _productQuantity: number;
    private _shippingCost: number;
    private _totalPrice: number;
    private _status: OrderStatusEnum;
    private _sellerId: string;
    private _sellerType: UserTypeEnum;
    private _buyerId: string;

    constructor(order: Partial<OrderEntity>) {
        super(order);
        Object.assign(this, order);
    }

    get productId(): string {
        return this._productId;
    }

    get productQuantity(): number {
        return this._productQuantity;
    }

    get shippingCost(): number {
        return this._shippingCost;
    }

    get totalPrice(): number {
        return this._totalPrice;
    }

    get status(): OrderStatusEnum {
        return this._status;
    }
    
    get sellerId(): string {
        return this._sellerId;
    }

    get sellerType(): UserTypeEnum {
        return this._sellerType;
    }

    get buyerId(): string {
        return this._buyerId;
    }

    set productId(productId: string) {
        this._productId = productId;
    }

    set productQuantity(productQuantity: number) {
        this._productQuantity = productQuantity;
    }

    set shippingCost(shippingCost: number) {
        this._shippingCost = shippingCost;
    }

    set totalPrice(totalPrice: number) {
        this._totalPrice = totalPrice;
    }

    set status(status: OrderStatusEnum) {
        this._status = status;
    }
    
    set sellerId(sellerId: string) {
        this._sellerId = sellerId;
    }

    set sellerType(sellerType: UserTypeEnum) {
        this._sellerType = sellerType;
    }

    set buyerId(buyerId: string) {
        this._buyerId = buyerId;
    }
}