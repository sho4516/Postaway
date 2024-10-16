import ValidationError from "../error-handler/validationError.js";

export const NumberValidator = (id) => {
  if (isNaN(Number(id))) {
    throw new ValidationError("Id is invalid", 400);
  }
  return true;
};