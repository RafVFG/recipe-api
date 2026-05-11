import { recipeRepository } from "../../repositories/recipe";
import { getRecipesPaginated } from "../../use-cases/get-recipes/paginated";
import { recipeListController } from "../controllers/recipe/list";

export function makeGetRecipes() {
    const repository = recipeRepository();
    const useCase = getRecipesPaginated(repository);
    const controller = recipeListController(useCase);

    return controller;
}
