import express from "express";
import cors from "cors";              
import connectDB from "./db/dbconfig.js";
import dotenv from 'dotenv';
dotenv.config();

import { userRouter } from './src/routes/users.js';
import { recipesRouter } from './src/routes/recipes.js';

const app = express();

const port = process.env.PORT;

connectDB();

app.use(express.json());
app.use(cors());

app.use("/auth", userRouter);
app.use("/recipes", recipesRouter);





app.listen(port, () => console.log(`Server running at port ${port}`));