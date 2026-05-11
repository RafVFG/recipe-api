import { UserFavorite } from "../../entities/user-recipe/interfaces/user-recipe"
import { UserRecipeRepositoryMethods } from "../../repositories/user-recipe/interfaces/methods"
import { GetFavoritesMethods } from "./interfaces/methods"

export function getFavorites(repo: UserRecipeRepositoryMethods): GetFavoritesMethods {
    async function run(idUser: number): Promise<UserFavorite[]> {
        return repo.findAll(idUser)
    }

    return { run }
}
