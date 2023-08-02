import ValidatorInterface from "../../@shared/validator/validator.interface";
import ProductYupValidator from "../validator/product.b.yup.validator";
import ProductInterface from "../entity/product.interface";
import ProductBYupValidator from "../validator/product.b.yup.validator";

export default class ProductValidatorFactory {
    static create(type: string): ValidatorInterface<ProductInterface> {
        if(type === "ProductB")
            return new ProductBYupValidator();
        return new ProductYupValidator();
    }
}