import express from "express";
import dotenv from "dotenv";
import path from "path";

import userRouter from "./src/features/user/user.routes.js";
import postRouter from "./src/features/post/post.router.js";
import likeRouter from "./src/features/like/like.route.js";
import NotFoundError from "./src/error-handler/notfFound.js";
import ValidationError from "./src/error-handler/validationError.js";
import logger from "./src/middlewares/logger.middleware.js";
import AuthorizationError from "./src/error-handler/authorizationError.js";
import commentRouter from "./src/features/comment/comment.router.js";
import jwtValidator from "./src/middlewares/jwt.middleware.js";
import swagger from "swagger-ui-express";
import apiDocs from "./swagger.json" assert { type: "json" };
import BadRequestError from "./src/error-handler/badRequestError.js";

// Initialize express server
const app = express();

app.use(express.json());
app.use(express.static(path.join(path.resolve(), "public", "images")));

// Configure the dotenv
const envFile = `.env.${process.env.NODE_ENV || "development"}`;
dotenv.config({ path: envFile });

//Swagger
app.use("/api-docs", swagger.serve, swagger.setup(apiDocs));

// User Controller
app.use("/api/users", userRouter);

//Post Controller
app.use("/api/posts", postRouter);

//Comment Controller
app.use("/api/comments", jwtValidator, commentRouter);

//Like Controller
app.use("/api/likes", jwtValidator, likeRouter);

// Error handler
app.use((err, req, res, next) => {
  logger.error({
    message: err.message,
    stack: err.stack,
    method: req.method,
    url: req.originalUrl,
    status: 500,
    user: req.userId ? req.userId : "Guest", // If authentication is present
  });

  if (err instanceof NotFoundError) {
    return res
      .status(err.statusCode)
      .json({ error: err.message, name: err.name, stack: err.stack });
  }

  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json({
      error: err.errors,
      name: err.name,
      stack: err.stack,
    });
  }

  if (err instanceof AuthorizationError) {
    return res.status(err.statusCode).json({
      error: err.message,
      name: err.name,
      stack: err.stack,
    });
  }

  if (err instanceof BadRequestError) {
    return res.status(err.statusCode).json({
      error: err.message,
      name: err.name,
      stack: err.stack,
    });
  }

  // Defualt error handling mechanism
  return res
    .status(500)
    .json({ error: "Internal Server Error", stack: err.stack });
});

// Start the server
app.listen(process.env.PORT, () => {
  console.log("running on port 3500");
});
