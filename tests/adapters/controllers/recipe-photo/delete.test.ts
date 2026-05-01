import { deleteRecipePhotoController } from '../../../../src/adapters/controllers/recipe-photo/delete'

const mockUseCase = { run: jest.fn() }

beforeEach(() => jest.clearAllMocks())

describe('deleteRecipePhotoController', () => {
    it('returns 400 when photoId is missing', async () => {
        const controller = deleteRecipePhotoController(mockUseCase)
        const result = await controller.handle({ params: {} })
        expect(result.statusCode).toBe(400)
    })

    it('returns 400 when photoId is not a number', async () => {
        const controller = deleteRecipePhotoController(mockUseCase)
        const result = await controller.handle({ params: { photoId: 'abc' } })
        expect(result.statusCode).toBe(400)
    })

    it('returns 404 when photo is not found', async () => {
        mockUseCase.run.mockRejectedValue(new Error('Foto não encontrada'))
        const controller = deleteRecipePhotoController(mockUseCase)
        const result = await controller.handle({ params: { photoId: '1' } })
        expect(result.statusCode).toBe(404)
    })

    it('returns 200 with deleted:true on success', async () => {
        mockUseCase.run.mockResolvedValue(undefined)
        const controller = deleteRecipePhotoController(mockUseCase)
        const result = await controller.handle({ params: { photoId: '1' } })
        expect(result.statusCode).toBe(200)
        expect(result.body).toEqual({ deleted: true })
    })

    it('calls use-case with the correct photoId', async () => {
        mockUseCase.run.mockResolvedValue(undefined)
        const controller = deleteRecipePhotoController(mockUseCase)
        await controller.handle({ params: { photoId: '7' } })
        expect(mockUseCase.run).toHaveBeenCalledWith(7)
    })

    it('returns 500 on unexpected error', async () => {
        mockUseCase.run.mockRejectedValue(new Error('db connection lost'))
        const controller = deleteRecipePhotoController(mockUseCase)
        const result = await controller.handle({ params: { photoId: '1' } })
        expect(result.statusCode).toBe(500)
    })
})
