import { getUserRecipes } from "../../use-cases/get-user-recipes"
import { recipeRepository } from "../../repositories/recipe"
import { userRecipeListController } from "../controllers/recipe/user-list"

export function makeGetUserRecipes() {
    const repo = recipeRepository()
    const useCase = getUserRecipes(repo)
    return userRecipeListController(useCase)
}
