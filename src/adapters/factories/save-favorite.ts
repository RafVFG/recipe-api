import { userRecipeRepository } from "../../repositories/user-recipe"
import { saveFavorite } from "../../use-cases/save-favorite"
import { saveFavoriteController } from "../controllers/user-recipe/save"

export function makeSaveFavorite() {
    const repository = userRecipeRepository()
    const useCase = saveFavorite(repository)
    const controller = saveFavoriteController(useCase)
    return controller
}
