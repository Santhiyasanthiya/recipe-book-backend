import dotenv from "dotenv";
dotenv.config();

import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { UserModel } from "../models/Users.js";

const TOKEN_KEY = process.env.TOKEN_KEY;

const router = express.Router();

router.post("/register", async (req, res) => {
  const { username, password, displayName } = req.body;

  const user = await UserModel.findOne({ username });

  if (user) {
    return res.json({ message: "User already exists!" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new UserModel({
    username,
    password: hashedPassword,
    displayName,
  });
  await newUser.save();

  res.json({ message: "User registered sucessfully" });
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await UserModel.findOne({ username });

  if (!user) {
    return res.status(404).json({ message: "User doesn't exist!" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res
      .status(401)
      .json({ message: "Username or Password is Incorrect" });
  }

  const token = jwt.sign({ id: user._id }, TOKEN_KEY);
  res.status(200).json({ token, userID: user._id });
});

router.get("/:userID", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userID).select(
      "displayName"
    );
    res.json(user.displayName);
  } catch (error) {
    console.error(error);
  }
});

export { router as userRouter };

export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (token) {
    jwt.verify(token, TOKEN_KEY, (err) => {
      if (err) {
        return res.sendStatus(403);
      }
      next();
    });
  } else {
    res.sendStatus(401);
  }
};
