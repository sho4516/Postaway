import CustomError from "./custom-error.js";

export default class ValidationError extends CustomError {
  constructor(message, statusCode) {
    super(message, statusCode);
  }
}
