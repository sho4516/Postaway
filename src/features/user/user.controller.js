import UserModel from "./user.model.js";
import logger from "../../middlewares/logger.middleware.js";

export default class UserController {
  getAllUsers(req, res, next) {
    const startTime = Date.now();
    console.log("start");

    // Log the request
    logger.info({
      message: "Fetching all users",
      method: req.method,
      url: req.originalUrl,
      user: req.user ? req.user.id : "Guest", // If authentication is present
    });

    const users = UserModel.getAll();
    console.log(users);

    // Log the response success
    logger.info({
      message: "Successfully fetched all users",
      method: req.method,
      url: req.originalUrl,
      status: 200,
      user: req.user ? req.user.id : "Guest",
      responseTime: `${Date.now() - startTime}ms`,
    });

    return res.status(200).json(users);
  }

  registerUser(req, res, next) {
    const user = req.body;
    UserModel.add(user)
      .then((data) => {
        return res.status(201).json(data);
      })
      .catch((err) => {
        return next(err);
      });
  }
}
