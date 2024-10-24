import PostModel from "./post.model.js";
import NotFoundError from "../../error-handler/notfFound.js";
import { NumberValidator } from "../../utils/utils.js";
import ValidationError from "../../error-handler/validationError.js";

export default class PostController {
  getAllPosts(req, res, next) {
    const captionFilter = req.query.caption;
    const posts = PostModel.getAll();

    const filteredPosts = captionFilter
      ? posts.filter((post) =>
          post.caption.toLowerCase().includes(captionFilter.toLowerCase())
        )
      : posts;
    return res.status(200).json(filteredPosts);
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

  getPostById(req, res, next) {
    const postId = req.params.id;
    try {
      NumberValidator(postId);
    } catch (err) {
      next(err);
    }
    const post = PostModel.getPostByPostId(postId);
    return res.status(200).json(post);
  }

  deletePostById(req, res, next) {
    const postId = req.params.id;
    try {
      NumberValidator(postId);
    } catch (err) {
      next(err);
    }
    const userId = req.userId;
    const email = req.email;
    PostModel.deletePostById(postId, userId, email);
    return res.status(200).json({
      success: true,
      message: `Post with post id ${postId} deleted successfully`,
    });
  }

  updatePostById(req, res, next) {
    try {
      const postId = req.params.id;
      NumberValidator(postId);
      const caption = req.body.caption;
      const fileName = req.file ? req.file.filename : null;
      const userId = req.userId;
      const updatedPost = PostModel.updatePost(
        postId,
        caption,
        fileName,
        userId
      );
      return res.status(201).json(updatedPost);
    } catch (err) {
      next(err);
    }
  }

  savePostAsDraft(req, res, next) {
    try {
      const caption = req.body.cation ? req.body.caption : null;
      const fileName = req.file ? req.file.filename : null;
      const draftedPost = PostModel.createPost(
        caption,
        fileName,
        req.userId,
        "draft"
      );
      return res.status(201).json({
        success: true,
        message: "Post saved as draft",
        post: draftedPost,
      });
    } catch (err) {
      next(err);
    }
  }

  getDrafts(req, res, next) {
    try {
      const userId = req.userId;
      const drafts = PostModel.getPostByStatus(userId, "draft");
      return res.status(200).json(drafts);
    } catch (err) {
      next(err);
    }
  }

  archivePost(req, res, next) {
    try {
      const postId = req.params.id;
      NumberValidator(postId);
      const archivedPost = PostModel.changePostStatus(
        req.userId,
        postId,
        "archived"
      );
      return res.status(201).json({
        success: true,
        message: "Post archived",
        post: archivedPost,
      });
    } catch (err) {
      next(err);
    }
  }

  publishPost(req, res, next) {
    try {
      const postId = req.params.id;
      NumberValidator(postId);
      const publishedPost = PostModel.changePostStatus(
        req.userId,
        postId,
        "published"
      );
      if (!publishedPost.caption || !publishedPost.imageURL) {
        return next(
          new ValidationError("post is invalid: caption/image missing", 301)
        );
      }
      return res.status(201).json({
        success: true,
        message: "Post published",
        post: publishedPost,
      });
    } catch (err) {
      next(err);
    }
  }

  getArchived(req, res, next) {
    try {
      const userId = req.userId;
      const archives = PostModel.getPostByStatus(userId, "archived");
      return res.status(200).json(archives);
    } catch (err) {
      next(err);
    }
  }
}
