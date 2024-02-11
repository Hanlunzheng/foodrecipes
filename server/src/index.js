import express from "express";
import { userRouter } from "./routes/users.js";

import { recipesRouter } from "./routes/recipes.js";
import cors from "cors";
import mongoose from "mongoose";

const app = express();

app.use(express.json());

app.use(cors());

app.use("/auth", userRouter);

app.use("/recipes", recipesRouter);

mongoose.connect(
  "mongodb+srv://Aaronfang:Arsenal19960716@cluster0.j5zm9lm.mongodb.net/recipe?retryWrites=true&w=majority"
);

app.listen(3001, () => console.log("server start"));
