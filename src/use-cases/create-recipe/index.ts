import { Recipe } from "../../entities/recipe/interfaces/recipe";
import { recipe } from "../../entities/recipe";
import { createOrUpdateRecipeMethods } from "./interfaces/methods";
import { RecipeRepositoryMethods } from "../../repositories/recipe/interfaces/methods";
import { TagRepositoryMethods } from "../../repositories/tag/interfaces/methods";

export function createOrUpdateRecipe(
    recipeRepository: RecipeRepositoryMethods,
    tagRepository: TagRepositoryMethods,
): createOrUpdateRecipeMethods {
    async function run(data: Recipe): Promise<void> {
        const recipeOrError = recipe(data);
        if (!recipeOrError) return;

        const recipeId = await recipeRepository.createOrUpdate(recipeOrError.getValue());

        const tagIds: number[] = [];
        for (const name of data.tags ?? []) {
            const id = await tagRepository.findOrCreate(name, data.idUser);
            tagIds.push(id);
        }

        await recipeRepository.syncTags(recipeId, tagIds);
    }

    return { run };
}
