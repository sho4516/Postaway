import CustomError from "./custom-error.js";

export default class AuthorizationError extends CustomError {
  constructor(message, statusCode) {
    super(message, statusCode);
  }
}
