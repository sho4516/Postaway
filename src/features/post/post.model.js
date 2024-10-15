import NotFoundError from "../../error-handler/notfFound.js";

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
}

let posts = [new PostModel(1, 2, "My new post", "dummyUrl")];
