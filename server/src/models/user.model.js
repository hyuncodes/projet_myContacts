import mongoose from "mongoose";
import validator from "validator";

const {isEmail} = validator;
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Veuillez entrer un email"],
    unique: true,
    lowercase: true,
    trim: true,
    validate: [isEmail, "Veuillez entrer un email valable"]
  },
  passwordHash: {
    type: String,
    required: [true, "Veuillez entrer un mot de passe"],
    minLength: [8, "Le mot de passé est trop court (min 8)"]
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    immutable: true,
  },
});

export const User = mongoose.model("User", userSchema);