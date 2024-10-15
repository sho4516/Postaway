import express from "express";
import jwtMiddleware from "../../middlewares/jwt.middleware.js";
import PostController from "./post.controller.js";
import { upload } from "../../middlewares/fileUpload.middleware.js";
import { addPostValidationMiddleware } from "../../middlewares/validation.middleware.js";
const postRouter = express.Router();
const postController = new PostController();

postRouter.get("/all", jwtMiddleware, postController.getAllPosts);
postRouter.post(
  "/",
  jwtMiddleware,
  upload.single("imageURL"),
  addPostValidationMiddleware,
  postController.uploadPost
);
postRouter.get("/", jwtMiddleware, postController.getPostByUserId);

export default postRouter;
