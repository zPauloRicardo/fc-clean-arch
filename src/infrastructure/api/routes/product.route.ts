import express, {Request, Response} from "express";
import CreateProductUseCase from "../../../usecases/product/create/create.product.usecase";
import ProductRepository from "../../product/repository/sequelize/product.repository";
import {InputCreateProductDto} from "../../../usecases/product/create/create.product.dto";
import ListProductUseCase from "../../../usecases/product/list/list.product.usecase";

export const productRoute = express.Router();

productRoute.post("/", async (req: Request, res: Response) => {
    const usecase = new CreateProductUseCase(new ProductRepository());
    try {
        const createProductDTO: InputCreateProductDto = {
            id: null,
            name: req.body.name,
            price: req.body.price
        };
        const output = await usecase.execute(createProductDTO);
        res.send(output);
    } catch (err) {
        res.status(500).send(err);
    }
});

productRoute.get("/", async (req: Request, res: Response) => {
    const usecase = new ListProductUseCase(new ProductRepository());
    const output = await usecase.execute();

    res.format({
        json: async () => res.send(output),
    });
});