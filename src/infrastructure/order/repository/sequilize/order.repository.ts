import Order from "../../../../domain/checkout/entity/order";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";
import OrderItem from "../../../../domain/checkout/entity/order_item";

export default class OrderRepository {
    async create(entity: Order): Promise<void> {
        await OrderModel.create(
            {
                id: entity.id,
                customer_id: entity.customerId,
                total: entity.total(),
                items: entity.items.map((item) => ({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    product_id: item.productId,
                    quantity: item.quantity,
                })),
            },
            {
                include: [{model: OrderItemModel}],
            }
        );
    }


    async update(entity: Order): Promise<void> {
        await OrderModel.sequelize.transaction(async (t) => {
            await OrderModel.update(
                {
                    total: entity.total(),
                    customer_id: entity.customerId,
                },
                {
                    where: {
                        id: entity.id,
                    },
                    transaction: t
                }
            );


            await OrderItemModel.destroy(
                {
                    where: {
                        order_id: entity.id
                    },
                    transaction: t
                }
            );


            const items = entity.items.map((item) => ({
                id: item.id,
                name: item.name,
                price: item.price,
                product_id: item.productId,
                quantity: item.quantity,
                order_id: entity.id,
            }));
            await OrderItemModel.bulkCreate(items, {transaction: t});
        });
    }

    async find(id: string): Promise<Order> {
        let orderModel;
        try {
            orderModel = await OrderModel.findOne({
                where: {
                    id,
                },
                include: ['items'],
                rejectOnEmpty: true,
            });
        } catch (error) {
            throw new Error("Order not found");
        }

        return new Order(orderModel.id,
            orderModel.customer_id, orderModel.items.map((item) => new OrderItem(
                    item.id,
                    item.name,
                    item.price,
                    item.product_id,
                    item.quantity
                )
            )
        );
    }


    async findAll(): Promise<Order[]> {
        const orders = await OrderModel.findAll(
            {
                include: ['items']
            }
        );

        return orders.map((orderModel) => {
            return new Order(orderModel.id, orderModel.customer_id, orderModel.items.map(item => new OrderItem(
                    item.id,
                    item.name,
                    item.price,
                    item.product_id,
                    item.quantity
                )
            ))
        });

    }

}
