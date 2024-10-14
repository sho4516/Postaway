import CustomError from "./custom-error.js";

export default class ValidationError extends CustomError {
  constructor(message) {
    super(message, 302);
  }
}
