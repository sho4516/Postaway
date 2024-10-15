import express from "express";
import dotenv from "dotenv";

import userRouter from "./src/features/user/user.routes.js";
import NotFoundError from "./src/error-handler/notfFound.js";
import ValidationError from "./src/error-handler/validationError.js";
import logger from "./src/middlewares/logger.middleware.js";

// Initialize express server
const app = express();

app.use(express.json());

// Configure the dotenv
const envFile = `.env.${process.env.NODE_ENV || "development"}`;
dotenv.config({ path: envFile });

// User Controller
app.use("/api/users", userRouter);


// Error handler
app.use((err, req, res, next) => {
  logger.error({
    message: err.message,
    stack: err.stack,
    method: req.method,
    url: req.originalUrl,
    status: 500,
    user: req.user ? req.user.id : "Guest",
  });

  if (err instanceof NotFoundError) {
    return res
      .status(err.statusCode)
      .json({ error: err.message, name: err.name, stack: err.stack });
  }

  if (err instanceof ValidationError) {
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
