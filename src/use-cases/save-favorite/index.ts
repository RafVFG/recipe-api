import { UserRecipeRepositoryMethods } from "../../repositories/user-recipe/interfaces/methods"
import { SaveFavoriteMethods } from "./interfaces/methods"

export function saveFavorite(repo: UserRecipeRepositoryMethods): SaveFavoriteMethods {
    async function run(idUser: number, idRecipe: number): Promise<{ message: string }> {
        const exists = await repo.recipeExists(idRecipe)
        if (!exists) throw new Error('Receita não encontrada')

        const result = await repo.save(idUser, idRecipe)
        return result === 'saved'
            ? { message: 'Receita favoritada com sucesso' }
            : { message: 'Receita já está nos favoritos' }
    }

    return { run }
}
