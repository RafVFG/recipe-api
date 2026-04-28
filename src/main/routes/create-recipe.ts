import { Router } from "express";
import { makeCreateOrUpdateRecipe } from "../../adapters/factories/create-recipe";
import { authGuard } from "../config/middleware/auth-guard";
import { adaptRoute } from "../config/adapt-route";

const createOrUpdateRecipeController = makeCreateOrUpdateRecipe();

export default (router: Router): void => {
    router.post("/create-or-update-recipe", authGuard, adaptRoute(createOrUpdateRecipeController))
}
