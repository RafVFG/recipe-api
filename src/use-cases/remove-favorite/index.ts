import { UserRecipeRepositoryMethods } from "../../repositories/user-recipe/interfaces/methods"
import { RemoveFavoriteMethods } from "./interfaces/methods"

export function removeFavorite(repo: UserRecipeRepositoryMethods): RemoveFavoriteMethods {
    async function run(idUser: number, idRecipe: number): Promise<void> {
        const result = await repo.remove(idUser, idRecipe)
        if (result === 'not_found') throw new Error('Favorito não encontrado')
    }

    return { run }
}
