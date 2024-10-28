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

const updatePostRules = [
  body("caption")
    .if((value, { req }) => req.body.caption !== undefined) // Only check if caption is provided
    .notEmpty()
    .withMessage("Caption must not be empty"),

  body("imageURL")
    .if((val, { req }) => req.body.imageURL !== undefined)
    .custom((val, { req }) => {
      if (!req.file) {
        throw new Error("File is required");
      }
      return true;
    }),
];

const uploadCommentRules = [
  body("content").notEmpty().withMessage("content cannot be empty"),
];

const updateCommentRules = [
  body("content")
    .if((val, { req }) => req.body.content != undefined)
    .notEmpty()
    .withMessage("content cannot be empty"),
];

const validateRules = (rules) => {
  return async (req, res, next) => {
    await Promise.all(rules.map((rule) => rule.run(req)));
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorArray = errors.array().map((error) => {
        // Mask password in the error response
        if (error.path == "password") {
          return { ...error, value: "***" };
        }
        return error;
      });

      // Log the error details (excluding password values)
      const mappedErrorArray = errorArray.map((error) => ({
        type: error.type,
        value: error.value,
        msg: error.msg,
        path: error.path,
        location: error.location,
      }));
      return next(new ValidationError(mappedErrorArray, 422));
    }
    next();
  };
};

// Export validation middlewares using the helper function
export const addUserValidationMiddleware = validateRules(signupRules);
export const loginUserValidationMiddleware = validateRules(signInRules);
export const addPostValidationMiddleware = validateRules(addPostRules);
export const updatePostValidationMiddleware = validateRules(updatePostRules);
export const addCommentValidationMiddleware = validateRules(uploadCommentRules);
export const updateCommentValidationMiddleware =
  validateRules(updateCommentRules);
