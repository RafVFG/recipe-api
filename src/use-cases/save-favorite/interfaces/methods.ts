export interface SaveFavoriteMethods {
    run: (idUser: number, idRecipe: number) => Promise<{ message: string }>
}
