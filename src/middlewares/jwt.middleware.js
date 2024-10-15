import jwt from "jsonwebtoken";

import AuthorizationError from "../error-handler/authorizationError.js";
import UserModel from "../features/user/user.model.js";
import NotFoundError from "../error-handler/notfFound.js";

const jwtValidator = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return next(new AuthorizationError("Unauthorized, No Auth header found", 401));
  }
  const token = authHeader.split(" ")[1];

  if (!token) {
    return next(
      new AuthorizationError("Unauthorized, No JWT token found", 401)
    );
  }

  try {
    const payload = jwt.verify(token, process.env.JWTSECRET);
    const userId = payload.userId;
    const user = UserModel.getById(userId);
    if (!user) {
      return next(new NotFoundError("User does not exist", 404));
    }
    req.userId = payload.userId;
    req.email = payload.email;
  } catch (err) {
    console.log(err);
    return next(err);
  }

  next();
};

export default jwtValidator;
