import ProductInterface from "./product.interface";
import {v4 as uuid} from "uuid";
import Entity from "../../@shared/entity/entity.abstract";
import NotificationError from "../../@shared/notification/notification.error";
import ProductValidatorFactory from "../factory/product.validator.factory";

export default class Product extends Entity implements ProductInterface {

    private _name: string;
    private _price: number;

    constructor(id: string, name: string, price: number) {
        super()
        this._id = id == null ? uuid() : id;
        this._name = name;
        this._price = price;
        this.validate();
    }

    get name(): string {
        return this._name;
    }

    get price(): number {
        return this._price;
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
