import { Router } from "express"
import { authGuard } from "../config/middleware/auth-guard"
import { adaptRoute } from "../config/adapt-route"
import { makeSaveFavorite } from "../../adapters/factories/save-favorite"
import { makeRemoveFavorite } from "../../adapters/factories/remove-favorite"
import { makeGetFavorites } from "../../adapters/factories/get-favorites"

const saveFavoriteController = makeSaveFavorite()
const removeFavoriteController = makeRemoveFavorite()
const getFavoritesController = makeGetFavorites()

export default (router: Router): void => {
    router.post("/user/favorites", authGuard, adaptRoute(saveFavoriteController))
    router.delete("/user/favorites/:idRecipe", authGuard, adaptRoute(removeFavoriteController))
    router.get("/user/favorites", authGuard, adaptRoute(getFavoritesController))
}
