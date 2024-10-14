export default class CustomError extends Error {
  constructor(message, statusCode) {
    super(message); // Call the parent class constructor (Error)
    this.statusCode = statusCode; // Add a status code property for HTTP status
    this.name = this.constructor.name; // Set the error class name
    Error.captureStackTrace(this, this.constructor); // Capture stack trace
  }
}
