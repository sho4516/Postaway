import ValidationError from "../../error-handler/validationError.js";
import logger from "../../middlewares/logger.middleware.js";
import { NumberValidator } from "../../utils/utils.js";
import PostModel from "../post/post.model.js";
import CommentModel from "./comment.model.js";

export default class CommentController {
  getCommentsByPostId(req, res, next) {
    const postId = req.params.id;
    try {
      NumberValidator(postId);
    } catch (err) {
      next(err);
    }

    // Pagination parameters with default values
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const comments = CommentModel.getCommentsByPostId(postId);

    // Paginating the comments
    const paginatedComments = comments.slice(skip, skip + limit);

    return res.status(200).json({
      page,
      totalComments: comments.length,
      totalPages: Math.ceil(comments.length / limit),
      comments: paginatedComments,
    });
  }

  uploadComment(req, res, next) {
    const postId = req.params.id;
    try {
      NumberValidator(postId);
    } catch (err) {
      return next(err);
    }
    const content = req.body.content;
    CommentModel.addComment(postId, req.userId, content, (err, newComment) => {
      if (err) {
        return next(err);
      }

      PostModel.incrementCommentCount(postId);
      logger.info({
        message: `Comment added on post with id ${postId}`,
        comment: JSON.stringify(newComment),
        method: req.method,
        url: req.originalUrl,
        status: 201,
        user: req.userId ? req.userId : "Guest", // If authentication is present
      });
      return res.status(201).json(newComment);
    });
  }

  deleteComment(req, res, next) {
    const commentId = req.params.id;

    try {
      NumberValidator(commentId); // Validate the comment ID

      CommentModel.deleteCommentById(
        commentId,
        req.userId,
        req.email,
        (err, postId) => {
          if (err) {
            return next(err); // Pass error to error handler
          }

          // Only decrement comment count if the deletion was successful
          try {
            PostModel.decrementCommentCount(postId);
          } catch (decrementError) {
            return next(decrementError);
          }

          logger.info({
            message: `Comment deleted with id ${commentId}`,
            method: req.method,
            url: req.originalUrl,
            status: 200,
            user: req.userId ? req.userId : "Guest",
          });

          return res
            .status(200)
            .json({ success: true, message: "Comment deleted successfully" });
        }
      );
    } catch (validationError) {
      return next(validationError); // Handle validation errors
    }
  }

  updateComment(req, res, next) {
    const commentId = req.params.id;
    try {
      NumberValidator(commentId);
    } catch (err) {
      next(err);
    }
    const content = req.body.content;
    CommentModel.updateCommentById(
      commentId,
      req.userId,
      req.email,
      content,
      (err, updatedComment) => {
        if (err) {
          return next(err);
        }

        logger.info({
          message: `Comment updated with id ${commentId}`,
          comment: JSON.stringify(updatedComment),
          method: req.method,
          url: req.originalUrl,
          status: 200,
          user: req.userId ? req.userId : "Guest", // If authentication is present
        });
        return res.status(200).json(updatedComment);
      }
    );
  }
}
