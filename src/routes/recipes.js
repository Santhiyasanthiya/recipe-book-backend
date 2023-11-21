import express from "express";
import { RecipeModel } from "../models/Recipes.js";
import { UserModel } from "../models/Users.js";
import { verifyToken } from "./users.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const response = await RecipeModel.find({});
    res.json(response);
  } catch (error) {
    res.json(error);
  }
});

router.get("/:recipeID", async (req, res) => {
  try {
    const recipe = await RecipeModel.findById(req.params.recipeID);
    res.json(recipe);
  } catch (error) {
    console.error(error);
  }
});

router.post("/", verifyToken, async (req, res) => {
  const recipe = new RecipeModel(req.body);

  const response = await recipe.save();
  console.log(response);
  res.json(response);
});

router.put("/:recipeID", async (req, res) => {
  try {
    const {
      name,
      ingredients,
      description,
      instructions,
      imageUrl,
      cookingTime,
      userOwner,
    } = req.body;
    const recipe = await RecipeModel.findByIdAndUpdate(
      req.params.recipeID,
      { ...req.body },
      { new: true }
    );
    recipe.save();
    res.json(recipe);
  } catch (error) {
    console.error(error);
  }
});

router.delete("/:recipeID", async (req, res) => {
  try {
    const recipe = await RecipeModel.findByIdAndDelete(req.params.recipeID);

    res.json("Item Deleted Successfully");
  } catch (error) {
    console.error(error);
  }
});

router.put("/", verifyToken, async (req, res) => {
  try {
    const user = await UserModel.findById(req.body.userID);
    const recipe = await RecipeModel.findById(req.body.recipeID);

    user.savedRecipes.push(recipe);
    await user.save();
    res.json({ savedRecipes: user.savedRecipes });
  } catch (error) {
    res.json(error);
  }
});

router.patch("/:userID/:recipeID/remove", verifyToken, async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userID);
    const recipe = await RecipeModel.findById(req.params.recipeID);

    user.savedRecipes.pull(recipe);
    await user.save();

    const savedRecipes = await RecipeModel.find({
      _id: { $in: user.savedRecipes },
    });
    res.json({ savedRecipes });
  } catch (error) {
    console.log(error);
  }
});

router.get("/savedRecipes/ids/:userID", verifyToken, async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userID);
    res.json({ savedRecipes: user?.savedRecipes });
  } catch (error) {
    res.json(error);
  }
});

router.get("/savedRecipes/:userID", verifyToken, async (req, res) => {
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

export { router as recipesRouter };
