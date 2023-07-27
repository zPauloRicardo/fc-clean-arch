import ProductFactory from "../../../domain/product/factory/product.factory";
import ListProductUseCase from "./list.product.usecase";

const product1 = ProductFactory.create("a", "Name", 1500);
const product2 = ProductFactory.create("b", "Name2", 2000);

const MockRepository = () => {
    return {
        create: jest.fn(),
        find: jest.fn(),
        update: jest.fn(),
        findAll: jest.fn().mockReturnValue(Promise.resolve([product1, product2])),
    };
};

describe("Unit test for listing product use case", () => {
    it("should list all products", async () => {
        const productRepository = MockRepository();
        const usecase = new ListProductUseCase(productRepository);

        const output = await usecase.execute();

        expect(output.products.length).toBe(2);
        expect(output.products[0].id).toBe(product1.id);
        expect(output.products[0].name).toBe("Name");
        expect(output.products[0].price).toBe(1500);

        expect(output.products[1].id).toBe(product2.id);
        expect(output.products[1].name).toBe("Name2");
        expect(output.products[1].price).toBe(4000);
    });
})