import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import product from "../models/product.js";

import fs from "fs";

const products_filter_fields = ["sku", "name", "price", "price_min", "price_max", "category"]

const getProducts = (req, res) => {

    const search_params = req.query;
    var filter_params = [];

    products_filter_fields.forEach(v => {
        if (search_params[[v]] !== undefined) {
            if (v === products_filter_fields[0] || v === products_filter_fields[1] || v === products_filter_fields[5]) {
                // *000*
                filter_params.push({ [[v]]: { "$regex": `${search_params[[v]]}`, "$options": "i" } })
            } else if (v === products_filter_fields[2]) {
                const desired_price = parseFloat(search_params[[v]]);
                filter_params.push({ [[v]]: desired_price });
            } else if (v === products_filter_fields[3]) {
                const desired_price = parseFloat(search_params[[v]]);
                filter_params.push({ "price": { "$gte": desired_price } })
            } else if (v === products_filter_fields[4]) {
                const desired_price = parseFloat(search_params[[v]]);
                filter_params.push({ "price": { "$lte": desired_price } })
            }
        }
    });

    if (filter_params.length !== 0) {
        product.find({ "$or": filter_params }).exec().then(products => {

            var producstFormatted = []
            const imagesPath = "http://localhost:3000/"
            products.forEach(prod => {
                var imagePath = "";

                if (prod.imagen !== "")
                    imagePath = imagesPath + prod.imagen


                producstFormatted.push({
                    "_id": prod._id,
                    "name": prod.name,
                    "sku": prod.sku,
                    "price": prod.price,
                    "stock": prod.stock,
                    "description": prod.description,
                    "category": prod.category,
                    "imagen": imagePath
                })
            })

            return res.status(StatusCodes.OK).json({ "products": producstFormatted });
        }).catch(productsError => {
            console.log(productsError);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ "error": "Ha ocurrido un error al buscar los productos" });
        });
    } else {
        product.find().exec().then(products => {
            var producstFormatted = []
            const imagesPath = "http://localhost:3000/"
            products.forEach(prod => {
                var imagePath = "";

                if (prod.imagen !== "")
                    imagePath = imagesPath + prod.imagen


                producstFormatted.push({
                    "_id": prod._id,
                    "name": prod.name,
                    "sku": prod.sku,
                    "price": prod.price,
                    "stock": prod.stock,
                    "description": prod.description,
                    "category": prod.category,
                    "imagen": imagePath
                })
            })
            return res.status(StatusCodes.OK).json({ "products": producstFormatted });
        }).catch(productsError => {
            console.log(productsError);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ "error": "Ha ocurrido un error al buscar los productos" });
        });
    }



    //return res.status(StatusCodes.OK).json({ "products": [] });
}

const addNewProduct = (req, res) => {
    var { name, sku, price, category, stock } = req.body;
    var filename = "";
    if (req.file !== undefined) {
        filename = req.file.filename;
    }

    price = Number(price);
    stock = Number(stock);

    new product({
        "_id": mongoose.Types.ObjectId(),
        "imagen": filename,
        sku,
        name,
        price,
        category,
        stock
    }).save().then(docCreated => {
        if (!docCreated) {
            return res.status(StatusCodes.BAD_REQUEST).json({ "error": "Ha ocurrido un error al guardar el producto" })
        }

        return res.status(StatusCodes.CREATED).json({ "message": "Se ha creado el producto", "doc": docCreated })

    }).catch(error => {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ "error": "Ha ocurrido un error al crear el producto" })
    });
}

// Casos
// 1. Subir imagen y reemplazar la que ya tenemos
// 2. No subir imagen 

const update_fields = ["imagen", "sku", "name", "price", "stock", "category", "description"]

const updateProductInfo = (req, res) => {
    const { id } = req.params;

    const update_ops = {};

    update_fields.forEach(v => {
        const ops = req.body[[v]];
        if (ops !== undefined && ops !== "") {
            update_ops[[v]] = ops;
        }
    });

    if (req.file) {
        update_ops["imagen"] = req.file.filename;
    }

    if (update_ops === {}) {
        return res.status(StatusCodes.BAD_REQUEST).json({ "error": "Los campos no pueden estar vacios" });
    }

    product.findByIdAndUpdate(id, update_ops).exec().then(oldDocument => {
        if (!oldDocument) {
            console.log("El producto solicitado no existe");
            return res.status(StatusCodes.NOT_FOUND).json({ "error": "El producto solicitado no existe" });
        }

        const { imagen } = oldDocument;
        if (imagen !== "") {
            fs.unlinkSync(`images/${imagen}`);
        }

        return res.status(StatusCodes.OK).json({ "message": "Se ha actualizado el producto" })

    }).catch(error => {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ "error": "Ha ocurrido un error al procesar la petición" })
    })
}

const deleteProduct = (req, res) => {
    const { id } = req.params;

    product.findByIdAndRemove(id).exec().then(delDoc => {
        if (!delDoc) {
            console.log("El producto solicitado no existe");
            return res.status(StatusCodes.NOT_FOUND).json({ "error": "El producto solicitado no existe" });
        }

        const { imagen } = delDoc;
        if (imagen !== "") {
            fs.unlinkSync(`images/${imagen}`);
        }

        return res.status(StatusCodes.OK).json({ "message": "Se ha eliminado el producto" });

    }).catch(error => {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ "error": "Ha ocurrido un error al procesar la petición" })
    });

    return res.status(StatusCodes.OK).json({ "message": "Se ha eliminado el producto" })
}

export { getProducts, addNewProduct, updateProductInfo, deleteProduct }