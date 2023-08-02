import ValidatorInterface from "../../@shared/validator/validator.interface";
import * as yup from "yup";
import ProductB from "../entity/product-b";

export default class ProductBYupValidator implements ValidatorInterface<ProductB> {
    validate(entity: ProductB): void {
        try {
            yup
                .object()
                .shape({
                    id: yup.string().required("Id is required"),
                    name: yup.string().required("Name is required"),
                    price: yup.number().moreThan(0, "Price must be greater than zero")
                })
                .validateSync({
                    id: entity.id,
                    name: entity.name,
                    price: entity.price
                }, {abortEarly: false});
        } catch (errors) {
            const e = errors as yup.ValidationError;
            e.errors.forEach(value => entity.notification.addError({
                context: "product",
                message: value
            }));
        }
    }

}