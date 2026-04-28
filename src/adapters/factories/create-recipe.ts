import { recipeRepository } from "../../repositories/recipe";
import { tagRepository } from "../../repositories/tag";
import { createOrUpdateRecipe } from "../../use-cases/create-recipe";
import { recipeController } from "../controllers/recipe";

export function makeCreateOrUpdateRecipe() {
    const recipeRepo = recipeRepository();
    const tagRepo = tagRepository();
    const useCase = createOrUpdateRecipe(recipeRepo, tagRepo);
    const controller = recipeController(useCase);

    return controller;
}
