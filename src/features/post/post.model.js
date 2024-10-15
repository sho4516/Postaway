import NotFoundError from "../../error-handler/notfFound.js";
import ValidationError from "../../error-handler/validationError.js";

export default class PostModel {
  constructor(_id, _userId, _caption, _imageURL) {
    this.id = _id;
    this.userId = _userId;
    this.caption = _caption;
    this.imageURL = _imageURL;
  }

  static getAll() {
    if (posts.length == 0) {
      throw new NotFoundError("No posts found", 404);
    }
    return posts;
  }

  static createPost(caption, fileName, userId) {
    const newPost = new PostModel(posts.length + 1, userId, caption, fileName);
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
    const postIndex = posts.findIndex((p) => p.id == postId);
    if (postIndex == -1) {
      throw new NotFoundError(`No post found with id ${postId}`, 404);
    }
    const post = posts.find((p) => p.id == postId);
    if (userId != post.userId) {
      throw new ValidationError(
        `${email} do not authorize to delete post with post id ${postId}`,
        401
      );
    }

    posts.splice(postIndex, 1);
  }

  static updatePost(postId, caption, fileName, userId) {
    const postIndex = posts.findIndex((p) => p.id == postId);
    if (postIndex == -1) {
      throw new NotFoundError(`No post found with id ${postId}`, 404);
    }
    const post = posts.find((p) => p.id == postId);
    if (userId != post.userId) {
      throw new ValidationError(
        `${email} do not authorize to update post with post id ${postId}`,
        401
      );
    }
    if (caption) {
      posts[postIndex].caption = caption;
    }

    if (fileName) {
      posts[postIndex].imageURL = fileName;
    }

    return posts[postIndex];
  }
}

let posts = [new PostModel(1, 2, "My new post", "dummyUrl")];
