import express from "express";
import CommentController from "./comment.controller.js";
import { addCommentValidationMiddleware, updateCommentValidationMiddleware } from "../../middlewares/validation.middleware.js";

const commentRouter = express.Router();
const commentController = new CommentController();

commentRouter.get("/:id", commentController.getCommentsByPostId);
commentRouter.post("/:id", addCommentValidationMiddleware, commentController.uploadComment);
commentRouter.delete("/:id", commentController.deleteComment);
commentRouter.put("/:id", updateCommentValidationMiddleware,commentController.updateComment);

export default commentRouter;
