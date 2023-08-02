import ProductInterface from "./product.interface";
import NotificationError from "../../@shared/notification/notification.error";
import Entity from "../../@shared/entity/entity.abstract";
import ProductValidatorFactory from "../factory/product.validator.factory";
import { v4 as uuid } from "uuid";

export default class ProductB extends Entity implements ProductInterface {
    private _name: string;
    private _price: number;

    constructor(id: string, name: string, price: number) {
        super()
        this._id = uuid()
        this._name = name;
        this._price = price;
        this.validate();
    }

    get id(): string {
        return this._id;
    }

    get name(): string {
        return this._name;
    }

    get price(): number {
        return this._price * 2;
    }

    changeName(name: string): void {
        this._name = name;
        this.validate();
    }

    changePrice(price: number): void {
        this._price = price;
        this.validate();
    }

    validate() {
        ProductValidatorFactory.create(this.constructor.name).validate(this);
        if (this.notification.hasErrors())
            throw new NotificationError(this.notification.getErrors());
    }
}
