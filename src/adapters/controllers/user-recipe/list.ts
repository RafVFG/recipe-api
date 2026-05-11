import { GetFavoritesMethods } from "../../../use-cases/get-favorites/interfaces/methods"
import { response } from "../interfaces/status-code"
import { HttpRequest, HttpResponse } from "./interfaces/http"
import { UserRecipeControllerMethods } from "./interfaces/methods"

export function listFavoritesController(getFavorites: GetFavoritesMethods): UserRecipeControllerMethods {
    async function handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        const res = response()
        const userId = httpRequest.userId

        if (!userId) return res.unauthorized('Não autenticado')

        try {
            const favorites = await getFavorites.run(userId)
            return res.ok(favorites)
        } catch (error) {
            return res.serverError(`Internal: ${error}`)
        }
    }

    return { handle }
}
