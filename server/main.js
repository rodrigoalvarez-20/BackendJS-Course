import express from "express";
import { StatusCodes } from "http-status-codes";
import morgan from "morgan";
import cors from "cors";

import UsersRouter from "../routes/users.js";
import ProductsRouter from "../routes/products.js";

let app = express();
let logger = morgan("dev");

app.use(logger);
app.use(cors());
app.use(express.json());

app.use(UsersRouter);
app.use(ProductsRouter);


/**
 * Actividad: Terminar la implementacion de las rutas de Usuarios, Productos y Ventas
 * Implementar el jwtSign y auth
 * Implementar configParser y/o env 
 * Implementar la base de datos de mongo
 */

app.get("/", (req, res) => {
    return res.status(StatusCodes.OK).json({"message": "Api correcta"});
});

app.use("*", (req, res) => {
    return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "No se ha encontrado el recurso solicitado" });
});

export default app;