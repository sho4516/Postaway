// logger.js
import { createLogger, format, transports } from "winston";
const { combine, timestamp, printf, colorize } = format;

// Define a custom format for logging
const customFormat = printf(
  ({ level, message, timestamp, stack, method, url, status, user }) => {
    return `${timestamp} [${level}]: ${stack}  
  message: ${message}
  method: ${method}
  url: ${url}
  status: ${status}
  user: ${user}
  `;
  }
);

const logger = createLogger({
  //level: "info", // You can set different log levels here (info, error, warn, etc.)
  format: combine(
    timestamp(),
    format.errors({ stack: true }),
    format.json()
    //format.prettyPrint(),
    //customFormat
  ),
  transports: [
    new transports.Console(), // Log to the console
    new transports.File({ filename: "logs/error.log", level: "error" }), // Log errors to a file
    new transports.File({ filename: "logs/info.log", level: "info" }), // Log info to a file
  ],
});

export default logger;
