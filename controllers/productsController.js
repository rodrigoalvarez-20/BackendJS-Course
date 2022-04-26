import { StatusCodes } from "http-status-codes";

const getProducts = (req, res) => {

    console.log(req.query);

    return res.status(StatusCodes.OK).json({ "products": [] });
}

const addNewProduct = (req, res) => {
    return res.status(StatusCodes.CREATED).json({"message": "Producto creado", "info": {}})
}

const updateProductInfo = (req, res) => {
    return res.status(StatusCodes.OK).json({"message": "Se ha actualizado la informacion"})
}

const deleteProduct = (req, res) => {
    return res.status(StatusCodes.OK).json({"message": "Se ha eliminado el producto"})
}

export { getProducts, addNewProduct, updateProductInfo, deleteProduct }