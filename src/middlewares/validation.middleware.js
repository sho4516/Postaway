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

const signInRules = [
  body("email")
    .notEmpty()
    .withMessage("Email field cannot be empty")
    .isEmail()
    .withMessage("Enter valid email id"),

  body("password").notEmpty().withMessage("password field cannot be empty"),
];

const addPostRules = [
  body("caption").notEmpty().withMessage("Caption is required"),
  body("imageURL").custom((val, { req }) => {
    if (!req.file) {
      throw new Error("File is required");
    }
    return true;
  }),
];

const validateRules = (rules) => {
  return async (req, res, next) => {
    await Promise.all(rules.map((rule) => rule.run(req)));
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorArray = errors.array().map((error) => {
        // Mask password in the error response
        if (error.path === "password") {
          return { ...error, value: "***" };
        }
        return error;
      });

      // Log the error details (excluding password values)
      const mappedErrorArray = errorArray
        .map((error) => JSON.stringify(error))
        .join(", ");
      logger.error({
        message: mappedErrorArray,
        method: req.method,
        url: req.originalUrl,
        status: 302,
        user: req.userId ? req.userId : "Guest",
      });

      return next(new ValidationError(mappedErrorArray, 302));
    }
    next();
  };
};

// Export validation middlewares using the helper function
export const addUserValidationMiddleware = validateRules(signupRules);
export const loginUserValidationMiddleware = validateRules(signInRules);
export const addPostValidationMiddleware = validateRules(addPostRules);
