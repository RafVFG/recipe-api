import { RecipeFilters, RecipeResult } from "../../../repositories/recipe/interfaces/methods";

export interface GetRecipesMethods {
    run: (filters?: RecipeFilters) => Promise<RecipeResult[]>
}
