import CreateProductUseCase from "./create.product.usecase";


const MockRepository = () => {
    return {
        find: jest.fn(),
        findAll: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
    };
};

describe("Unit test create product use case", () => {
    it("should create a product", async () => {
        const productRepository = MockRepository();
        const productCreateUseCase = new CreateProductUseCase(productRepository);

        const input = {
            id: "123",
            name: "Name",
            price: 1500
        };

        const output = await productCreateUseCase.execute(input);
        expect(output).toEqual({
            id: "123",
            name: "Name",
            price: 1500,
        });
    });
});