import CustomError from "./custom-error.js";

export default class ValidationError extends CustomError {
  constructor(errors, statusCode) {
    super("Validation error occured", statusCode);
    this.errors = errors;
  }
}
