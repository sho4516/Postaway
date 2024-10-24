import UserModel from "./user.model.js";
import logger from "../../middlewares/logger.middleware.js";
import jwt from "jsonwebtoken";

export default class UserController {
  getAllUsers(req, res, next) {
    const startTime = Date.now();
    console.log("start");

    // Log the request
    logger.info({
      message: "Fetching all users",
      method: req.method,
      url: req.originalUrl,
      user: req.userId ? req.userId : "Guest", // If authentication is present
    });

    const users = UserModel.getAll();
    console.log(users);

    // Log the response success
    logger.info({
      message: "Successfully fetched all users",
      method: req.method,
      url: req.originalUrl,
      status: 200,
      user: req.userId ? req.userId : "Guest", // If authentication is present
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

  async login(req, res, next) {
    try {
      const validUser = await UserModel.confirmLogin(req.body);
      const jwtToken = jwt.sign(
        {
          userId: validUser.id,
          email: validUser.email,
        },
        process.env.JWTSECRET,
        { expiresIn: "8h" }
      );
      return res.status(200).json({ success: true, token: jwtToken });
    } catch (err) {
      next(err);
    }
  }
}
