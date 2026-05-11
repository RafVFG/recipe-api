import { RecipeFilters, RecipeResult, PaginatedRecipesResult } from "../../../repositories/recipe/interfaces/methods";

export interface GetRecipesMethods {
    run: (filters?: RecipeFilters) => Promise<RecipeResult[]>
}

export interface GetRecipesPaginatedMethods {
    run: (filters: RecipeFilters | undefined, page: number, pageSize: number) => Promise<PaginatedRecipesResult>
}
