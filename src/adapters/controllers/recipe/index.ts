import { createOrUpdateRecipeMethods } from "../../../use-cases/create-recipe/interfaces/methods";
import { response } from "../interfaces/status-code";
import { HttpRequest, HttpResponse } from "./interfaces/http";
import { RecipeControlerMethods } from "./interfaces/methods";

export function recipeController(createOrUpdateRecipe: createOrUpdateRecipeMethods): RecipeControlerMethods {
    async function handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        const { body } = httpRequest;
        const userId = httpRequest.userId;
        const fieldsMissing = [];
        const res = response();

        if (!userId) return res.unauthorized("Unauthorized");
        if (!body.name) fieldsMissing.push("name");
        if (!body.ingredients || body.ingredients.length === 0) fieldsMissing.push("ingredients");
        if (!body.directions || body.directions.length === 0) fieldsMissing.push("directions");
        if (fieldsMissing.length > 0) return res.badRequest(`Missing params: ${fieldsMissing}`);

        const recipe = {
            id: body.id ?? undefined,
            idUser: userId,
            name: body.name,
            description: body.description ?? undefined,
            ingredients: body.ingredients,
            directions: body.directions,
            rating: body.rating ?? undefined,
            tags: body.tags ?? undefined,
            prepTime: body.prepTime ?? undefined,
            yields: body.yields ?? undefined,
        };

        try {
            await createOrUpdateRecipe.run(recipe);
        } catch (error) {
            return res.serverError(`Internal: ${error}`);
        }

        return res.ok();
    }

    return { handle };
}
