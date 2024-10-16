import NotFoundError from "../../error-handler/notfFound.js";
import ValidationError from "../../error-handler/validationError.js";
import logger from "../../middlewares/logger.middleware.js";

export default class PostModel {
  constructor(_id, _userId, _caption, _imageURL, _comments, _likes) {
    this.id = _id;
    this.userId = _userId;
    this.caption = _caption;
    this.imageURL = _imageURL;
    this.comments = _comments;
    this.likes = _likes;
  }

  static getAll() {
    if (posts.length == 0) {
      throw new NotFoundError("No posts found", 404);
    }
    return posts;
  }

  static createPost(caption, fileName, userId) {
    const newPost = new PostModel(
      posts.length + 1,
      userId,
      caption,
      fileName,
      0,
      0
    );
    posts.push(newPost);
    return newPost;
  }

  static getPostByUserId(userId) {
    const userPosts = [...posts];
    const filteredPosts = userPosts.filter((p) => p.userId == userId);
    return filteredPosts;
  }

  static getPostByPostId(postId) {
    const post = posts.find((p) => p.id == postId);
    if (!post) {
      throw new NotFoundError(`No post found with id ${postId}`, 404);
    }
    return post;
  }

  static deletePostById(postId, userId, email) {
    const postIndex = this._findPostIndex(postId);
    const post = posts[postIndex];

    if (userId != post.userId) {
      throw new ValidationError(
        `${email} is not authorized to delete this post`,
        401
      );
    }

    posts.splice(postIndex, 1); // Efficiently remove post
  }

  static updatePost(postId, caption, fileName, userId) {
    const postIndex = this._findPostIndex(postId);
    const post = posts[postIndex];

    if (userId != post.userId) {
      throw new ValidationError(
        `User is not authorized to update post with id ${postId}`,
        401
      );
    }

    if (caption) posts[postIndex].caption = caption;
    if (fileName) posts[postIndex].imageURL = fileName;

    return posts[postIndex];
  }

  static incrementCommentCount(postId) {
    const postIndex = this._findPostIndex(postId);
    posts[postIndex].comments += 1;
    return posts[postIndex];
  }

  static decrementCommentCount(postId) {
    const postIndex = this._findPostIndex(postId);
    if (posts[postIndex].comments == 0) {
      throw new ValidationError(
        `Comment count is zero and cannot be decremented further`,
        400
      );
    }

    posts[postIndex].comments -= 1;
    return posts[postIndex];
  }

  static incrementPostLike(postId){
    const postIndex = this._findPostIndex(postId);
    posts[postIndex].likes += 1;
    return posts[postIndex];
  }

  static decrementPostLike(postId) {
    const postIndex = this._findPostIndex(postId);
    if (posts[postIndex].likes == 0) {
      throw new ValidationError(
        `Likes count is zero and cannot be decremented further`,
        400
      );
    }

    posts[postIndex].likes -= 1;
    return posts[postIndex];
  }

  static _findPostIndex(postId) {
    const postIndex = posts.findIndex((p) => p.id == postId);
    if (postIndex == -1) {
      throw new NotFoundError(`No post found with id ${postId}`, 404);
    }
    return postIndex;
  }
}

let posts = [new PostModel(1, 2, "My new post", "dummyUrl", 0, 0)];
