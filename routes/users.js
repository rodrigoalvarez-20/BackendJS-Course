import { Router } from "express";

import { getUserProfileMethod, loginUserMethod, registerUserMethod, updateUserProfileMethod } from "../controllers/usersController.js";

const UsersRouter = Router();

UsersRouter.get("/users/me", getUserProfileMethod);
UsersRouter.patch("/users/me", updateUserProfileMethod);

UsersRouter.post("/users/login", loginUserMethod);
UsersRouter.post("/users/register", registerUserMethod);

export default UsersRouter;