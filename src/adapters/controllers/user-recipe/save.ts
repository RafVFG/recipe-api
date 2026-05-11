import { SaveFavoriteMethods } from "../../../use-cases/save-favorite/interfaces/methods"
import { response } from "../interfaces/status-code"
import { HttpRequest, HttpResponse } from "./interfaces/http"
import { UserRecipeControllerMethods } from "./interfaces/methods"

export function saveFavoriteController(saveFavorite: SaveFavoriteMethods): UserRecipeControllerMethods {
    async function handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        const res = response()
        const userId = httpRequest.userId
        const idRecipe = httpRequest.body?.idRecipe

        if (!userId) return res.unauthorized('Não autenticado')
        if (!Number.isInteger(idRecipe) || idRecipe <= 0) return res.badRequest('Missing body: idRecipe')

        try {
            const result = await saveFavorite.run(userId, idRecipe)
            return res.ok(result)
        } catch (error: any) {
            if (error?.message === 'Receita não encontrada') return res.notFound('Receita não encontrada')
            return res.serverError(`Internal: ${error}`)
        }
    }

    return { handle }
}
