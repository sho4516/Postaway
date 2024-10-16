import AuthorizationError from "../../error-handler/authorizationError.js";
import NotFoundError from "../../error-handler/notfFound.js";
import PostModel from "../post/post.model.js";
import UserModel from "../user/user.model.js";

export default class CommentModel {
  constructor(_id, _userId, _postId, _content) {
    this.id = _id;
    this.userId = _userId;
    this.postId = _postId;
    this.content = _content;
  }

  static getCommentsByPostId(postId) {
    const post = PostModel.getPostByPostId(postId);
    if (!post) {
      throw new NotFoundError(`No post found with id ${postId}`, 404);
    }
    const filteredComments = comments.filter((c) => c.postId == postId);
    if (filteredComments.length == 0) {
      throw new NotFoundError(
        `No comments found on post with id ${postId}`,
        404
      );
    }
    return filteredComments;
  }

  static addComment(postId, userId, content, cb) {
    const post = PostModel.getPostByPostId(postId);
    const user = UserModel.getById(userId);
    const initialCommentsLength = comments.length;
    this._validatePostAndUser(post, user, postId, userId);

    const newComment = new CommentModel(
      comments.length + 1,
      userId,
      postId,
      content
    );

    const length = comments.push(newComment);
    if (length == initialCommentsLength + 1) {
      cb(null, newComment);
    } else {
      cb(new Error("Failed to add comment"), null);
    }
  }

  static deleteCommentById(commentId, userId, email, cb) {
    const commentIndex = comments.findIndex((c) => c.id == commentId);
    if (commentIndex == -1) {
      throw new NotFoundError(`No comment found with id ${commentId}`, 404);
    }

    this._authorizeCommentAction(comments[commentIndex], userId, email);

    const deletedComment = comments.splice(commentIndex, 1);
    if (deletedComment.length > 0) {
      cb(null, deletedComment[0].postId);
    } else {
      cb(new Error("Failed to delete comment"), null);
    }
  }

  static updateCommentById(commentId, userId, email, content, cb) {
    const commentIndex = comments.findIndex((c) => c.id == commentId);
    if (commentIndex == -1) {
      throw new NotFoundError(`No comment found with id ${commentId}`, 404);
    }

    this._authorizeCommentAction(comments[commentIndex], userId, email);

    if (content && content.trim()) {
      comments[commentIndex].content = content;
      cb(null, comments[commentIndex]);
    } else {
      cb(new Error("failed to update comment"), null);
    }
  }

  // Utility method to validate post and user
  static _validatePostAndUser(post, user, postId, userId) {
    if (!post) {
      throw new NotFoundError(`No post found with id ${postId}`, 404);
    }
    if (!user) {
      throw new NotFoundError(`No user found with id ${userId}`, 404);
    }
  }

  // Utility method for authorization
  static _authorizeCommentAction(comment, userId, email) {
    if (comment.userId != userId) {
      throw new AuthorizationError(
        `User with id ${userId} and email ${email} is not authorized to perform this action`,
        401
      );
    }
  }
}

let comments = [];
