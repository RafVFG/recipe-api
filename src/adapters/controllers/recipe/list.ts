import { GetRecipesPaginatedMethods } from "../../../use-cases/get-recipes/interfaces/methods";
import { response } from "../interfaces/status-code";
import { HttpRequest, HttpResponse } from "./interfaces/http";
import { RecipeListControllerMethods } from "./interfaces/methods";

export function recipeListController(getRecipes: GetRecipesPaginatedMethods): RecipeListControllerMethods {
    async function handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        const res = response();

        try {
            const q = httpRequest.query ?? {};

            const pageRaw = parseInt(q.page as string, 10);
            const page = isNaN(pageRaw) ? 1 : pageRaw;

            const pageSizeRaw = parseInt(q.pageSize as string, 10);
            const pageSize = isNaN(pageSizeRaw) ? 12 : Math.min(pageSizeRaw, 100);

            if (page < 1) return res.badRequest("page deve ser um número ≥ 1");
            if (pageSize < 1) return res.badRequest("pageSize deve estar entre 1 e 100");

            const name = q.name as string | undefined;
            const ingredient = q.ingredient as string | undefined;

            const tagsRaw = q.tags as string | undefined;
            const tagsArr = tagsRaw
                ? tagsRaw.split(",").map((t: string) => t.trim()).filter(Boolean)
                : undefined;
            const tags = tagsArr && tagsArr.length > 0 ? tagsArr : undefined;

            const prepTimeNum = parseInt(q.prepTime as string, 10);
            const prepTime = isNaN(prepTimeNum) ? undefined : prepTimeNum;

            const sort = q.sort === 'favorites' ? 'favorites' as const : undefined;

            const hasFilterKeys = "name" in q || "ingredient" in q || "tags" in q || "prepTime" in q || sort !== undefined;
            const filters = hasFilterKeys ? { name, ingredient, tags, prepTime, sort } : undefined;

            const { recipes, total } = await getRecipes.run(filters, page, pageSize);

            const totalPages = total === 0 ? 0 : Math.ceil(total / pageSize);

            return res.ok({
                data: recipes,
                pagination: { page, pageSize, total, totalPages },
            });
        } catch (error) {
            return res.serverError(`Internal: ${error}`);
        }
    }

    return { handle };
}
