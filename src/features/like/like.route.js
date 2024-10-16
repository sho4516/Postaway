import express from "express";
import LikeController from "./like.controller.js";

const likeRouter = express.Router();
const likeController = new LikeController();

likeRouter.get("/:postId", likeController.getLikesByPostId);
likeRouter.get("/toggle/:postId", likeController.toggleLike);

export default likeRouter;
