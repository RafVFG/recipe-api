import { Recipe } from "../../../entities/recipe/interfaces/recipe";

export interface RecipeResult {
    id: number
    idUser: number
    name: string
    description: string | null
    directions: string
    rating: number | null
    prepTime: number | null
    yields: number | null
    created_at: string
    updated_at: string
    ingredients: { id: number, name: string, amount: string | null }[]
    photos: { id: number, url: string, isPrimary: number }[]
    tags: string[]
}

export interface RecipeFilters {
    name?: string
    ingredient?: string
    tags?: string[]
    prepTime?: number
}

export interface RecipeRepositoryMethods {
    createOrUpdate: (data: Recipe) => Promise<number>
    getAll: (filters?: RecipeFilters) => Promise<RecipeResult[]>
    getById: (id: number) => Promise<RecipeResult | null>
    remove: (id: number) => Promise<void>
    syncTags: (idRecipe: number, tagIds: number[]) => Promise<void>
    getTagsByRecipeId: (idRecipe: number) => Promise<string[]>
}
