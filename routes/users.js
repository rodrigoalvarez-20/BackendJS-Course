import { Router } from "express";

import { getUserProfileMethod, getUserProfileV2, loginUserMethod, registerUserMethod, updateUserProfileMethod } from "../controllers/usersController.js";
import { auth_user } from "../middlewares/index.js";

const UsersRouter = Router();

//UsersRouter.get("/users/me", getUserProfileMethod);

UsersRouter.get("/users/profile", auth_user, getUserProfileV2);

UsersRouter.patch("/users/me", auth_user, updateUserProfileMethod);

UsersRouter.post("/users/login", loginUserMethod);
UsersRouter.post("/users/register", registerUserMethod);

export default UsersRouter;