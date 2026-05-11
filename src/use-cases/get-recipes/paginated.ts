import { RecipeRepositoryMethods, RecipeFilters, PaginatedRecipesResult } from "../../repositories/recipe/interfaces/methods";
import { GetRecipesPaginatedMethods } from "./interfaces/methods";

export function getRecipesPaginated(recipeRepository: RecipeRepositoryMethods): GetRecipesPaginatedMethods {
    async function run(
        filters: RecipeFilters | undefined,
        page: number,
        pageSize: number
    ): Promise<PaginatedRecipesResult> {
        const { recipes, total } = await recipeRepository.getPaginated(filters, page, pageSize);

        const enriched = await Promise.all(
            recipes.map(async (r) => {
                const tags = await recipeRepository.getTagsByRecipeId(r.id);
                return { ...r, tags };
            })
        );

        return { recipes: enriched, total };
    }

    return { run };
}
