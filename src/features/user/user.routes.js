import express from "express";

import UserController from "./user.controller.js";
import { addUserValidationMiddleware } from "../../middlewares/validation.middleware.js";

const userRouter = express.Router();
const userController = new UserController();

userRouter.get("/", userController.getAllUsers);
userRouter.post("/signup", addUserValidationMiddleware, userController.registerUser);

export default userRouter;
