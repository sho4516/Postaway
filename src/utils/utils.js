import BadRequestError from "../error-handler/badRequestError.js";

export const NumberValidator = (id) => {
  if (isNaN(Number(id))) {
    const mappedErrorArray = [
      {
        type: "field",
        value: "id",
        msg: "Id is invalid",
        path: "",
        location: "",
      },
    ];
    throw new BadRequestError(mappedErrorArray, 400);
  }
  return true;
};
