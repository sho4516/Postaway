import CustomError from "./custom-error.js";

export default class NotFoundError extends CustomError {
  constructor(message, statusCode) {
    super(message, statusCode);
  }
}
