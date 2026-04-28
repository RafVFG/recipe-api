import { RecipeRepositoryMethods } from "../../repositories/recipe/interfaces/methods";
import { GetRecipesMethods } from "./interfaces/methods";

export function getRecipes(recipeRepository: RecipeRepositoryMethods): GetRecipesMethods {
    async function run(filters?: { ingredient?: string }) {
        const recipes = await recipeRepository.getAll(filters);

        return Promise.all(
            recipes.map(async (r) => {
                const tags = await recipeRepository.getTagsByRecipeId(r.id);
                return { ...r, tags };
            })
        );
    }

    return { run };
}
