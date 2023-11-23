import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import connectDB from "./db/dbconfig.js";
import dotenv from "dotenv";
dotenv.config();

import { userRouter } from "./src/routes/users.js";
import { recipesRouter } from "./src/routes/recipes.js";

const app = express();

const port = process.env.PORT;

connectDB();

app.use(cors({
  origin:"*"
}));

app.use(express.json());

app.get("/", function (req, res) {
  res.send("Hello Guys Welcome to this app💐🎉🎊");
});

app.use("/auth", userRouter);
app.use("/recipes", recipesRouter);

app.listen(port, () => console.log(`Server running at port ${port}`));
