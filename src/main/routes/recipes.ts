import { Router } from "express";
import { makeGetRecipes } from "../../adapters/factories/get-recipes";
import { makeGetRecipeById } from "../../adapters/factories/get-recipe-by-id";
import { makeDelRecipe } from "../../adapters/factories/del-recipe";
import { authGuard } from "../config/middleware/auth-guard";
import { adaptRoute } from "../config/adapt-route";

const listController = makeGetRecipes();
const showController = makeGetRecipeById();
const delController = makeDelRecipe();

export default (router: Router): void => {
    router.get("/recipes", adaptRoute(listController))
    router.get("/recipe/:id", adaptRoute(showController))
    router.delete("/recipe/:id", authGuard, adaptRoute(delController))
}
