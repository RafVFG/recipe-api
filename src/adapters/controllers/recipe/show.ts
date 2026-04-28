import { GetRecipeByIdMethods } from "../../../use-cases/get-recipe-by-id/interfaces/methods";
import { response } from "../interfaces/status-code";
import { HttpRequest, HttpResponse } from "./interfaces/http";
import { RecipeShowControllerMethods } from "./interfaces/methods";

export function recipeShowController(getRecipeById: GetRecipeByIdMethods): RecipeShowControllerMethods {
    async function handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        const res = response();
        const id = Number(httpRequest.params?.id);

        if (!id) return res.badRequest("Missing params: id");

        try {
            const recipe = await getRecipeById.run(id);
            if (!recipe) return res.notFound("Recipe not found");
            return res.ok(recipe);
        } catch (error) {
            return res.serverError(`Internal: ${error}`);
        }
    }

    return { handle }
}
