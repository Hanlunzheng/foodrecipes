import { RecipeModel } from "../models/Recipes.js";

import express from "express";
import mongoose from "mongoose";
import { UserModel } from "../models/Users.js";
import { verifyToken } from "../routes/users.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const response = await RecipeModel.find({});

    res.json(response);
  } catch (error) {
    res.json(error);
  }
});

router.post("/", async (req, res) => {
  const recipe = new RecipeModel(req.body);
  try {
    const response = await recipe.save();

    res.json(response);
  } catch (error) {
    res.json(error);
  }
});

router.put("/", async (req, res) => {
  try {
    const recipe = await RecipeModel.findById(req.body.recipeID);
    const user = await UserModel.findById(req.body.userID);
    user.savedRecipes.push(recipe);

    await user.save();
    res.json({ savedRecipes: user.savedRecipes });

    // res.json(response);
  } catch (error) {
    res.json(error);
  }
});

router.get("/savedRecipes/ids/:userID", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userID);
    res.json({ savedRecipes: user?.savedRecipes });
  } catch (error) {
    res.json(error);
  }
});
router.get("/savedRecipes/:userID", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userID);
    const savedRecipes = await RecipeModel.find({
      _id: { $in: user.savedRecipes },
    });
    res.json({ savedRecipes });
  } catch (error) {
    res.json(error);
  }
});
// Endpoint to unsave a recipe
router.delete("/recipes/:recipeID/unsave", async (req, res) => {
  const { userID, recipeID } = req.params;

  try {
    // Find the user by ID
    const user = await UserModel.findById(userID);

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Remove the recipe ID from the user's savedRecipes
    user.savedRecipes = user.savedRecipes.filter(
      (savedRecipeID) => savedRecipeID.toString() !== recipeID
    );

    // Save the updated user
    await user.save();

    // Retrieve the updated list of saved recipes
    const updatedSavedRecipes = await RecipeModel.find({
      _id: { $in: user.savedRecipes },
    });

    res.json({ savedRecipes: updatedSavedRecipes });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export { router as recipesRouter };
