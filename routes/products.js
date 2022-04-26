import { Router } from "express";
import { addNewProduct, deleteProduct, getProducts, updateProductInfo } from "../controllers/productsController.js";
import { auth_user } from "../middlewares/index.js";


const ProductsRouter = Router();

ProductsRouter.get("/products", auth_user, getProducts);

ProductsRouter.post("/products", addNewProduct);

ProductsRouter.patch("/products/:id", updateProductInfo)

ProductsRouter.delete("/products/:id", deleteProduct)

export default ProductsRouter;