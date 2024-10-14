import { body, validationResult } from "express-validator";
import ValidationError from "../error-handler/validationError.js";
import logger from "./logger.middleware.js";

const signupRules = [
  body("name").notEmpty().withMessage("name must not be empty"),
  body("email").notEmpty().withMessage("email is required"),
  body("email").isEmail().withMessage("enter valid email"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/\d/)
    .withMessage("Password must contain at least one number")
    .matches(/[a-zA-Z]/)
    .withMessage("Password must contain at least one letter"),
];

export const addUserValidationMiddleware = async (req, res, next) => {
  await Promise.all(signupRules.map((rule) => rule.run(req)));
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorArray = errors.array();
    const filteredErrorArray = errorArray.map((error) => {
      if (error.path === "password") {
        return { ...error, value: "***" }; // Mask the password value
      }
      return error;
    });
    const mappedErrorArray = filteredErrorArray
      .map((error) => JSON.stringify(error))
      .join(", ");
    logger.error({
      message: mappedErrorArray,
      method: req.method,
      url: req.originalUrl,
      status: 302,
      user: req.user ? req.user.id : "Guest",
    });
    return next(new ValidationError(mappedErrorArray, 302));
  }
  next();
};
