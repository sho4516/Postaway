import NotFoundError from "../../error-handler/notfFound.js";
import PostModel from "../post/post.model.js";

export default class LikeModel {
  constructor(_id, _userId, _postId) {
    this.id = _id;
    this.userId = _userId;
    this.postId = _postId;
  }

  static getByPostId(postId) {
    const post = PostModel.getPostByPostId(postId);
    if (!post) {
      throw new NotFoundError("post not found", 404);
    }
    const filteredLikes = likes.filter((l) => l.postId == postId);
    if (filteredLikes.length == 0) {
      throw new NotFoundError("No likes found", 404);
    }
    return filteredLikes;
  }

  static toggleLike(postId, userId, cb) {
    const post = PostModel.getPostByPostId(postId);
    const initialLikesCount = likes.length;
    if (!post) {
      throw new NotFoundError("post not found", 404);
    }
    const likeIndex = likes.findIndex(
      (l) => l.userId == userId && l.postId == postId
    );
    if (likeIndex == -1) {
      const likeModel = new LikeModel(likes.length + 1, userId, postId);
      const newLikesCount = likes.push(likeModel);
      if (newLikesCount == initialLikesCount + 1) {
        cb(null, true);
      } else {
        cb(
          new Error(`Error occured while liking the post with id ${postId}`),
          null
        );
      }
    } else {
      cb(null, false);
    }
  }
}

let likes = [];
