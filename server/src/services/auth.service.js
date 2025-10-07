import bcrypt from "bcrypt";
import {User} from "../models/user.model.js";
import validator from "validator";
import {generateAccessToken, generateRefreshToken,} from "./token.service.js";

const SALT_ROUNDS = Number.parseInt(process.env.BCRYPT_SALT_ROUNDS);

function validateEmail(email) {
  return typeof email === "string" && validator.isEmail(email);
}

function validatePassword(pw) {
  return typeof pw === "string" && pw.length >= 8;
}

export const authService = {
  async register({email, password}) {
    if (!validateEmail(email)) {
      const err = new Error("L'email n'est pas valide");
      err.status = 400;
      throw err;
    }

    const existing = await User.findOne({email: email.toLowerCase()});
    if (existing) {
      const err = new Error("Cet email est déjà utilisé.");
      err.status = 400;
      throw err;
    }

    if (!validatePassword(password)) {
      const err = new Error("Le mot de passé est trop court (min 8)");
      err.status = 400;
      throw err;

    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const userData = await User.create({email: email.toLowerCase(), passwordHash});
    return {
      id: userData._id.toString(),
      email: userData.email,
      createdAt: userData.createdAt
    };
  },

  async login({email, password}) {
    if (!validateEmail(email) || typeof password !== "string") {
      const err = new Error("Identifiants invalides");
      err.status = 401;
      throw err;
    }

    const user = await User.findOne({email: email.toLowerCase()});
    if (!user) {
      const err = new Error("Identifiants invalides");
      err.status = 401;
      throw err;
    }

    const checker = await bcrypt.compare(password, user.passwordHash);
    if (!checker) {
      const err = new Error("Identifiants invalides");
      err.status = 401;
      throw err;
    }

    const userData = {
      id: user._id.toString(),
      email: user.email,
      createdAt: user.createdAt
    };
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    return {user: userData, accessToken, refreshToken};
  },
};