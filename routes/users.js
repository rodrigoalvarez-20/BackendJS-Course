import { Router } from "express";
import { StatusCodes } from "http-status-codes";

import { usersGetMethod, NOMBRE } from "../controllers/usersController.js";

const UsersRouter = Router();

UsersRouter.get("/users", usersGetMethod);

UsersRouter.post("/users", (req, res) => {
    return res.status(StatusCodes.CREATED).send({ "message": "Hola desde users" });
});

UsersRouter.patch();
UsersRouter.delete()

export default UsersRouter;