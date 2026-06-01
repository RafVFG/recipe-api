import { RecipeResult } from "../../../repositories/recipe/interfaces/methods"

export interface GetUserRecipesMethods {
    run: (idUser: number) => Promise<RecipeResult[]>
}
