import express from "express";

import UserController from "./user.controller.js";
import {
  addUserValidationMiddleware,
  loginUserValidationMiddleware,
} from "../../middlewares/validation.middleware.js";

const userRouter = express.Router();
const userController = new UserController();

userRouter.get("/", userController.getAllUsers);
userRouter.post(
  "/signup",
  addUserValidationMiddleware,
  userController.registerUser
);
userRouter.post("/signin", loginUserValidationMiddleware, userController.login);

export default userRouter;
