import { RecipeRepositoryMethods } from "../../repositories/recipe/interfaces/methods";
import { GetRecipeByIdMethods } from "./interfaces/methods";

export function getRecipeById(recipeRepository: RecipeRepositoryMethods): GetRecipeByIdMethods {
    async function run(id: number) {
        const recipe = await recipeRepository.getById(id);
        if (!recipe) return null;

        const tags = await recipeRepository.getTagsByRecipeId(id);
        return { ...recipe, tags };
    }

    return { run };
}
