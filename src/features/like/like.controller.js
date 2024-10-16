import logger from "../../middlewares/logger.middleware.js";
import { NumberValidator } from "../../utils/utils.js";
import PostModel from "../post/post.model.js";
import LikeModel from "./like.model.js";

export default class LikeController {
  toggleLike(req, res, next) {
    const postId = req.params.postId;
    try {
      NumberValidator(postId);
    } catch (err) {
      next(err);
    }

    LikeModel.toggleLike(postId, req.userId, (err, result) => {
      if (err) {
        return next(err);
      }

      if (result) {
        PostModel.incrementPostLike(postId);
        logger.info({
          message: `${req.userId} like a post with id ${postId}`,
          method: req.method,
          url: req.originalUrl,
          status: 200,
          user: req.userId ? req.userId : "Guest", // If authentication is present
        });
        return res
          .status(200)
          .json({ success: true, message: "post liked successfully" });
      } else {
        PostModel.decrementPostLike(postId);
        logger.info({
          message: `${req.userId} unliked a post with id ${postId}`,
          method: req.method,
          url: req.originalUrl,
          status: 200,
          user: req.userId ? req.userId : "Guest", // If authentication is present
        });
        return res
          .status(200)
          .json({ success: true, message: "post unliked successfully" });
      }
    });
  }

  getLikesByPostId(req, res, next) {
    const postId = req.params.postId;
    const likes = LikeModel.getByPostId(postId);
    return res.status(200).json(likes);
  }
}
