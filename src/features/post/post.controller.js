import PostModel from "./post.model.js";
import NotFoundError from "../../error-handler/notfFound.js";

export default class PostController {
  getAllPosts(req, res, next) {
    const posts = PostModel.getAll();
    return res.status(200).json(posts);
  }

  uploadPost(req, res, next) {
    try {
      const caption = req.body.caption;
      const fileName = req.file.filename;
      const userId = req.userId;
      const createdPost = PostModel.createPost(caption, fileName, userId);
      return res.status(201).json(createdPost);
    } catch (err) {
      next(err);
    }
  }

  getPostByUserId(req, res, next) {
    const userId = req.userId;
    if (!userId) {
      return next(new NotFoundError(`No user found`, 404));
    }
    const posts = PostModel.getPostByUserId(userId);
    if (posts.length == 0) {
      return res
        .status(404)
        .json({ message: `No posts found for ${req.email}` });
    } else {
      return res.status(200).json(posts);
    }
  }
}
