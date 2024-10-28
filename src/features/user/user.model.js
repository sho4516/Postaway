import NotFoundError from "../../error-handler/notfFound.js";
import ValidationError from "../../error-handler/validationError.js";
import bcrypt from "bcrypt";

export default class UserModel {
  constructor(_id, _name, _email, _password) {
    this.id = _id;
    this.name = _name;
    this.email = _email;
    this.password = _password;
  }

  static getAll() {
    if (users.length == 0) {
      throw new NotFoundError("No user found", 404);
    }
    return users;
  }

  static async add(user) {
    const hashedPassword = await UserModel.hashPassword(user.password);
    const newUser = new UserModel(
      users.length + 1,
      user.name,
      user.email,
      hashedPassword
    );
    users.push(newUser);
    return newUser;
  }

  static async confirmLogin(userCreds) {
    const email = userCreds.email;
    const user = users.find((u) => u.email == email);
    if (!user) {
      throw new NotFoundError(`No user found with email ${email}`, 404);
    }
    const hashedPassword = user.password;
    const match = await bcrypt.compare(userCreds.password, hashedPassword);
    const mappedErrorArray = [
      {
        type: "field",
        value: "password",
        msg: `Incorrect password`,
        path: "",
        location: "",
      },
    ];
    if (!match) {
      throw new ValidationError(mappedErrorArray, 422);
    }
    return user;
  }

  static getById(userId) {
    const user = users.find((u) => u.id == userId);
    return user;
  }

  static async hashPassword(password) {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  }
}

const users = [
  // new UserModel(1, "shobhit", "shobhitgoyalg@gmail.com", "Ast@194400"),
  // new UserModel(2, "Aayush", "Ayush@gmail.com", "12345"),
];
