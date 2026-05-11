import { UserFavorite } from "../../../entities/user-recipe/interfaces/user-recipe"

export interface UserRecipeRepositoryMethods {
    save: (idUser: number, idRecipe: number) => Promise<'saved' | 'already_exists'>
    remove: (idUser: number, idRecipe: number) => Promise<'removed' | 'not_found'>
    findAll: (idUser: number) => Promise<UserFavorite[]>
    recipeExists: (idRecipe: number) => Promise<boolean>
}
