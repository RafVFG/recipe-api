import { DeleteRecipePhotoMethods } from '../../../use-cases/delete-recipe-photo/interfaces/methods'
import { response } from '../interfaces/status-code'
import { HttpRequest, HttpResponse } from './interfaces/http'

export function deleteRecipePhotoController(deleteRecipePhoto: DeleteRecipePhotoMethods) {
    async function handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        const res = response()
        const photoId = Number(httpRequest.params?.photoId)

        if (!photoId) return res.badRequest('Missing params: photoId')

        try {
            await deleteRecipePhoto.run(photoId)
        } catch (error: any) {
            if (error?.message === 'Foto não encontrada') return res.notFound('Foto não encontrada')
            return res.serverError(`Internal: ${error}`)
        }

        return res.ok({ deleted: true })
    }

    return { handle }
}
