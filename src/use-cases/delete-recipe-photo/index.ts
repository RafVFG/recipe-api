import { unlink } from 'fs/promises'
import path from 'path'
import { RecipePhotoRepositoryMethods } from '../../repositories/recipe-photo/interfaces/methods'
import { DeleteRecipePhotoMethods } from './interfaces/methods'

export function deleteRecipePhoto(recipePhotoRepository: RecipePhotoRepositoryMethods): DeleteRecipePhotoMethods {
    async function run(photoId: number): Promise<void> {
        const photo = await recipePhotoRepository.findById(photoId)
        if (!photo) throw new Error('Foto não encontrada')

        const filename = path.basename(photo.url)
        const filePath = path.resolve(__dirname, '../../../uploads', filename)

        try {
            await unlink(filePath)
        } catch (err: any) {
            if (err.code !== 'ENOENT') throw err
        }

        await recipePhotoRepository.remove(photoId)

        if (photo.isPrimary) {
            await recipePhotoRepository.promotePrimary(photo.idRecipe)
        }
    }

    return { run }
}
