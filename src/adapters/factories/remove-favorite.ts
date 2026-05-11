import { userRecipeRepository } from "../../repositories/user-recipe"
import { removeFavorite } from "../../use-cases/remove-favorite"
import { removeFavoriteController } from "../controllers/user-recipe/remove"

export function makeRemoveFavorite() {
    const repository = userRecipeRepository()
    const useCase = removeFavorite(repository)
    const controller = removeFavoriteController(useCase)
    return controller
}
