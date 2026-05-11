import { UserFavorite } from "../../entities/user-recipe/interfaces/user-recipe"

export interface GetFavoritesMethods {
    run: (idUser: number) => Promise<UserFavorite[]>
}
