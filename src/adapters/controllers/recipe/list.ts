import { GetRecipesMethods } from "../../../use-cases/get-recipes/interfaces/methods";
import { response } from "../interfaces/status-code";
import { HttpRequest, HttpResponse } from "./interfaces/http";
import { RecipeListControllerMethods } from "./interfaces/methods";

export function recipeListController(getRecipes: GetRecipesMethods): RecipeListControllerMethods {
    async function handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        const res = response();

        try {
            const q = httpRequest.query ?? {};
            const name = q.name as string | undefined;
            const ingredient = q.ingredient as string | undefined;

            const tagsRaw = q.tags as string | undefined;
            const tagsArr = tagsRaw
                ? tagsRaw.split(",").map((t: string) => t.trim()).filter(Boolean)
                : undefined;
            const tags = tagsArr && tagsArr.length > 0 ? tagsArr : undefined;

            const prepTimeNum = parseInt(q.prepTime as string, 10);
            const prepTime = isNaN(prepTimeNum) ? undefined : prepTimeNum;

            const recipes = await getRecipes.run({ name, ingredient, tags, prepTime });
            return res.ok(recipes);
        } catch (error) {
            return res.serverError(`Internal: ${error}`);
        }
    }

    return { handle };
}
