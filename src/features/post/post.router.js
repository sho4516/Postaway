import express from "express";
import jwtMiddleware from "../../middlewares/jwt.middleware.js";
import PostController from "./post.controller.js";
import { upload } from "../../middlewares/fileUpload.middleware.js";
import {
  addPostValidationMiddleware,
  updatePostValidationMiddleware,
} from "../../middlewares/validation.middleware.js";
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
postRouter.get("/drafts", jwtMiddleware, postController.getDrafts);
postRouter.get("/archives", jwtMiddleware, postController.getArchived);
postRouter.get("/:id", jwtMiddleware, postController.getPostById);
postRouter.delete("/:id", jwtMiddleware, postController.deletePostById);
postRouter.put(
  "/:id",
  jwtMiddleware,
  upload.single("imageURL"),
  updatePostValidationMiddleware,
  postController.updatePostById
);
postRouter.post(
  "/draft",
  jwtMiddleware,
  upload.single("imageURL"),
  postController.savePostAsDraft
);
postRouter.post("/archive/:id", jwtMiddleware, postController.archivePost);
postRouter.post("/publish/:id", jwtMiddleware, postController.publishPost);

export default postRouter;
