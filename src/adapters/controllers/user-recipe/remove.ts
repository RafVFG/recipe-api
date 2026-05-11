import { RemoveFavoriteMethods } from "../../../use-cases/remove-favorite/interfaces/methods"
import { response } from "../interfaces/status-code"
import { HttpRequest, HttpResponse } from "./interfaces/http"
import { UserRecipeControllerMethods } from "./interfaces/methods"

export function removeFavoriteController(removeFavorite: RemoveFavoriteMethods): UserRecipeControllerMethods {
    async function handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        const res = response()
        const userId = httpRequest.userId
        const idRecipe = parseInt(httpRequest.params?.idRecipe, 10)

        if (!userId) return res.unauthorized('Não autenticado')
        if (isNaN(idRecipe) || idRecipe <= 0) return res.badRequest('Missing params: idRecipe')

        try {
            await removeFavorite.run(userId, idRecipe)
            return res.ok({ message: 'Receita removida dos favoritos' })
        } catch (error: any) {
            if (error?.message === 'Favorito não encontrado') return res.notFound('Favorito não encontrado')
            return res.serverError(`Internal: ${error}`)
        }
    }

    return { handle }
}
