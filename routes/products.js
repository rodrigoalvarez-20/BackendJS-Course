import { Router } from "express";
import { StatusCodes } from "http-status-codes";

const ProductsRouter = Router();

ProductsRouter.get("/products", (req, res) => {
    return res.status(StatusCodes.OK).json({ "message": "Respuesta desde products" });
});

ProductsRouter.post("/products", (req, res) => {
    return res.status(StatusCodes.CREATED).json({ "message": "Se ha creado el producto" });
});

export default ProductsRouter;