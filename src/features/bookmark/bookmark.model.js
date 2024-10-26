import NotFoundError from "../../error-handler/notfFound.js";
import PostModel from "../post/post.model.js";
import UserModel from "../user/user.model.js";

export default class BookmarkModel {
  constructor(_id, _userId, _postId) {
    this.id = _id;
    this.userId = _userId;
    this.postId = _postId;
  }

  static addBookmark(userId, postId) {
    if (!userId || !UserModel.getById(userId)) {
      throw new NotFoundError("Invalid User, user not found", 404);
    }

    if (!postId || PostModel._findPostIndex(postId) == -1) {
      throw new NotFoundError("Invalid postId, Post not found", 404);
    }

    if (this.isBookmarked(userId, postId)) {
      return null;
    }

    const newBookmark = new BookmarkModel(bookmarks.length + 1, userId, postId);
    bookmarks.push(newBookmark);
    return newBookmark;
  }

  static removeBookmark(userId, postId) {
    if (!userId || !UserModel.getById(userId)) {
      throw new NotFoundError("Invalid User, user not found", 404);
    }

    if (!postId || PostModel._findPostIndex(postId) == -1) {
      throw new NotFoundError("Invalid postId, Post not found", 404);
    }

    const bookmarkIndex = bookmarks.findIndex(
      (b) => b.userId == userId && b.postId == postId
    );

    if (bookmarkIndex != -1) {
      bookmarks.splice(bookmarkIndex, 1);
      return true;
    }

    return false;
  }

  static getBookmarks(userId) {
    return bookmarks.filter((b) => b.userId == userId);
  }

  static isBookmarked(userId, postId) {
    return bookmarks.some((b) => {
      return b.userId == userId && b.postId == postId;
    });
  }
}

let bookmarks = [];
