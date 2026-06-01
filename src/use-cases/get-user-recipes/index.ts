import { RecipeRepositoryMethods, RecipeResult } from "../../repositories/recipe/interfaces/methods"
import { GetUserRecipesMethods } from "./interfaces/methods"

export function getUserRecipes(recipeRepository: RecipeRepositoryMethods): GetUserRecipesMethods {
    async function run(idUser: number): Promise<RecipeResult[]> {
        const recipes = await recipeRepository.getByUser(idUser)
        const enriched = await Promise.all(
            recipes.map(async (r) => {
                const tags = await recipeRepository.getTagsByRecipeId(r.id)
                return { ...r, tags }
            })
        )
        return enriched
    }
    return { run }
}
