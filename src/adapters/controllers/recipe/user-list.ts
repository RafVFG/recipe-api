import { GetUserRecipesMethods } from "../../../use-cases/get-user-recipes/interfaces/methods"
import { response } from "../interfaces/status-code"
import { HttpRequest, HttpResponse } from "./interfaces/http"

export function userRecipeListController(getUserRecipes: GetUserRecipesMethods) {
    async function handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        const res = response()
        const userId = httpRequest.userId
        if (!userId) return res.unauthorized("Unauthorized")
        try {
            const recipes = await getUserRecipes.run(userId)
            return res.ok(recipes)
        } catch (error) {
            return res.serverError(`Internal: ${error}`)
        }
    }
    return { handle }
}
