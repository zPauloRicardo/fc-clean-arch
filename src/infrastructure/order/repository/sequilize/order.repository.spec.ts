import {Sequelize} from "sequelize-typescript";
import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import Customer from "../../../../domain/customer/entity/customer";
import Address from "../../../../domain/customer/value-object/address";
import Product from "../../../../domain/product/entity/product";
import CustomerModel from "../../../customer/repository/sequelize/customer.model";
import CustomerRepository from "../../../customer/repository/sequelize/customer.repository";
import ProductModel from "../../../product/repository/sequelize/product.model";
import ProductRepository from "../../../product/repository/sequelize/product.repository";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";
import OrderRepository from "./order.repository";

describe("Order repository test", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: {force: true},
        });

        await sequelize.addModels([
            CustomerModel,
            OrderModel,
            OrderItemModel,
            ProductModel,
        ]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should create a new order", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("123", "Customer 1");
        const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product("123", "Product 1", 10);
        await productRepository.create(product);

        const orderItem = new OrderItem(
            "1",
            product.name,
            product.price,
            product.id,
            2
        );

        const order = new Order("123", "123", [orderItem]);

        const orderRepository = new OrderRepository();
        await orderRepository.create(order);

        const orderModel = await OrderModel.findOne({
            where: {id: order.id},
            include: ["items"],
        });

        expect(orderModel.toJSON()).toStrictEqual({
            id: "123",
            customer_id: "123",
            total: order.total(),
            items: [
                {
                    id: orderItem.id,
                    name: orderItem.name,
                    price: orderItem.price,
                    quantity: orderItem.quantity,
                    order_id: "123",
                    product_id: "123",
                },
            ],
        });
    });


    it("should update an order", async () => {
        const customerRepository = new CustomerRepository();
        const orderRepository = new OrderRepository();
        const customer = new Customer("123", "Customer 1");
        const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
        customer.changeAddress(address);
        await customerRepository.create(customer);
        const productRepository = new ProductRepository();
        const product = new Product("123", "Product 1", 10);
        await productRepository.create(product);

        const orderItem = new OrderItem(
            "1",
            product.name,
            product.price,
            product.id,
            1
        );

        const order = new Order("123", "123", [orderItem]);

        await orderRepository.create(order);
        orderItem.changeQuantity(3);
        order.changeItems([orderItem]);
        await orderRepository.update(order);
        const updatedOrder = await OrderModel.findOne({
            where: {
                id: order.id
            },
            include: ["items"],
        });
        expect(updatedOrder.toJSON()).toStrictEqual({
            id: "123",
            customer_id: "123",
            total: order.total(),
            items: [
                {
                    id: orderItem.id,
                    name: orderItem.name,
                    price: orderItem.price,
                    quantity: orderItem.quantity,
                    order_id: "123",
                    product_id: "123",
                },
            ],
        })
    });

    it("should find an order", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("123", "Customer 1");
        const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
        customer.changeAddress(address);
        await customerRepository.create(customer);
        const productRepository = new ProductRepository();
        const product = new Product("123", "Product 1", 10);
        await productRepository.create(product);
        const orderItem = new OrderItem(
            "1",
            product.name,
            product.price,
            product.id,
            2);

        const order = new Order("123", "123", [orderItem]);
        const orderRepository = new OrderRepository();
        await orderRepository.create(order);
        const databaseOrder = await orderRepository.find(order.id);
        expect(databaseOrder).toStrictEqual(order);
    });


    it("should find all orders", async () => {
        const customerRepository = new CustomerRepository();
        const orderRepository = new OrderRepository();
        const productRepository = new ProductRepository();
        const customer = new Customer("123", "Customer 1");
        const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const productOne = new Product("1", "Product 1", 10);
        const productTwo = new Product("2", "Product 2", 10);
        const productThree = new Product("3", "Product 3", 10);
        await productRepository.create(productOne);
        await productRepository.create(productTwo);
        await productRepository.create(productThree);

        const orderItemOne = new OrderItem(
            "1",
            productOne.name,
            productOne.price,
            productOne.id,
            1
        );


        const orderItemTwo = new OrderItem(
            "2",
            productTwo.name,
            productTwo.price,
            productTwo.id,
            1
        );
        const orderItemThree = new OrderItem(
            "3",
            productThree.name,
            productThree.price,
            productThree.id,
            1
        );

        const order1 = new Order(
            "1",
            customer.id,
            [
                orderItemOne,
                orderItemTwo
            ]
        );
        const order2 = new Order(
            "2",
            customer.id,
            [
                orderItemThree
            ]
        );

        await orderRepository.create(order1);
        await orderRepository.create(order2);

        const ordersFound = await orderRepository.findAll();
        expect(ordersFound).toEqual([order1, order2]);
    });
});
