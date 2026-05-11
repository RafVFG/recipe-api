import { userRecipeRepository } from "../../repositories/user-recipe"
import { getFavorites } from "../../use-cases/get-favorites"
import { listFavoritesController } from "../controllers/user-recipe/list"

export function makeGetFavorites() {
    const repository = userRecipeRepository()
    const useCase = getFavorites(repository)
    const controller = listFavoritesController(useCase)
    return controller
}
