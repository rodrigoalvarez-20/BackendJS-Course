import express from "express";
import { StatusCodes } from "http-status-codes";
import morgan from "morgan";
import cors from "cors";
import mongoose from "mongoose";

import UsersRouter from "../routes/users.js";
import ProductsRouter from "../routes/products.js";
import { getMongoCreds } from "../utils/configs.js";


let app = express();
let logger = morgan("dev");

app.use(logger);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ "extended": true }))

//Conexión con la DB

const { user, pwd, host } = getMongoCreds();

mongoose.connect(
    `mongodb+srv://${user}:${pwd}@${host}`,
    {
        useNewUrlParser: true, useUnifiedTopology: true
    }
);

mongoose.Promise = global.Promise;


app.use(UsersRouter);
app.use(ProductsRouter);


/**
 * Actividad: Terminar la implementacion de las rutas de Usuarios, Productos y Ventas
 * Implementar el jwtSign y auth (Listo)
 * Implementar configParser y/o env (Medio)
 * Implementar la base de datos de mongo (Listo)
 * File Uploads para imagenes
 * Ver lo de las peticiones web (copy as cURL)
 * Ver lo del servidor (Heroku y EC2/Azure)
 * PM2
 * Crontab
 * Webhooks (Crear y utilizar)
 * Mailing crudo, notificaciones (telegram)
 */

app.get("/", (req, res) => {
    return res.status(StatusCodes.OK).json({ "message": "Api correcta" });
});

app.use("*", (req, res) => {
    return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "No se ha encontrado el recurso solicitado" });
});

export default app;