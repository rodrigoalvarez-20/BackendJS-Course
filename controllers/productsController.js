import { StatusCodes } from "http-status-codes";
import product from "../models/product.js";

const products_filter_fields = ["sku", "name", "price", "price_min", "price_max", "category"]

const getProducts = (req, res) => {

    const search_params = req.query;
    var filter_params = [];
    console.log(search_params);

    products_filter_fields.forEach(v => {
        if(search_params[[v]] !== undefined){
            if (v === products_filter_fields[0] || v === products_filter_fields[1] || v === products_filter_fields[5]){
                // *000*
                filter_params.push({ [[v]]: { "$regex": `${search_params[[v]]}`, "$options": "i" } })
            } else if(v === products_filter_fields[2]){
                const desired_price = parseFloat(search_params[[v]]);
                filter_params.push({ [[v]]: desired_price });
            } else if(v === products_filter_fields[3]){
                const desired_price = parseFloat(search_params[[v]]);
                filter_params.push({ "price": { "$gte": desired_price } })
            } else if (v === products_filter_fields[4]) {
                const desired_price = parseFloat(search_params[[v]]);
                filter_params.push({ "price": { "$lte": desired_price } })
            }
        }
    });

    console.log(filter_params);

    if (filter_params.length !== 0){
        product.find({ "$or": filter_params }).exec().then(products => {
            return res.status(StatusCodes.OK).json({ "products": products });
        }).catch(productsError => {
            console.log(productsError);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ "error": "Ha ocurrido un error al buscar los productos" });
        });
    }else {
        product.find().exec().then(products => {
            return res.status(StatusCodes.OK).json({ "products": products });
        }).catch(productsError => {
            console.log(productsError);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ "error": "Ha ocurrido un error al buscar los productos" });
        });
    }

    

    //return res.status(StatusCodes.OK).json({ "products": [] });
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