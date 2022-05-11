import { Router } from "express";
import { addNewProduct, deleteProduct, getProducts, updateProductInfo } from "../controllers/productsController.js";
import { auth_user } from "../middlewares/index.js";
import multer from "multer";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "images/")
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now();
        cb(null, file.originalname.split(".")[0] + "_" + uniqueSuffix + "." + file.mimetype.split("/")[1])
    },
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype.includes("png") || file.mimetype.includes("jpeg") || file.mimetype.includes("jpg")){
        cb(null, true)
    }

    cb(null, false);
}

const uploadProductFile = multer({ storage: storage, limits: {fileSize: 1024 * 1024 * 5}, fileFilter: fileFilter})

const ProductsRouter = Router();

ProductsRouter.get("/products", getProducts);

ProductsRouter.post("/products", uploadProductFile.single("image"), addNewProduct);

ProductsRouter.patch("/products/:id", uploadProductFile.single("imagen"),  updateProductInfo)

ProductsRouter.delete("/products/:id", deleteProduct)

export default ProductsRouter;