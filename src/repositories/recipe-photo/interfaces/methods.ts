export interface RecipePhoto {
    id: number
    idRecipe: number
    url: string
    isPrimary: number
}

export interface RecipePhotoRepositoryMethods {
    add: (idRecipe: number, url: string, isPrimary: boolean) => Promise<void>
    remove: (id: number) => Promise<void>
    findById: (id: number) => Promise<RecipePhoto | null>
    promotePrimary: (idRecipe: number) => Promise<void>
}
