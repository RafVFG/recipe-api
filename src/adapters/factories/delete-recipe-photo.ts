import { recipePhotoRepository } from '../../repositories/recipe-photo'
import { deleteRecipePhoto } from '../../use-cases/delete-recipe-photo'
import { deleteRecipePhotoController } from '../controllers/recipe-photo/delete'

export function makeDeleteRecipePhoto() {
    const repository = recipePhotoRepository()
    const useCase = deleteRecipePhoto(repository)
    const controller = deleteRecipePhotoController(useCase)
    return controller
}
