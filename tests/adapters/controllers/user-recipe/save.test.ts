import { saveFavoriteController } from '../../../../src/adapters/controllers/user-recipe/save'

const mockUseCase = { run: jest.fn() }

beforeEach(() => jest.clearAllMocks())

describe('saveFavoriteController', () => {
    it('returns 400 when idRecipe is missing from body', async () => {
        const controller = saveFavoriteController(mockUseCase)
        const result = await controller.handle({ body: {}, userId: 1 })
        expect(result.statusCode).toBe(400)
    })

    it('returns 400 when idRecipe is not a positive integer', async () => {
        const controller = saveFavoriteController(mockUseCase)
        const result = await controller.handle({ body: { idRecipe: -1 }, userId: 1 })
        expect(result.statusCode).toBe(400)
    })

    it('returns 400 when idRecipe is a float', async () => {
        const controller = saveFavoriteController(mockUseCase)
        const result = await controller.handle({ body: { idRecipe: 1.5 }, userId: 1 })
        expect(result.statusCode).toBe(400)
    })

    it('returns 404 when recipe does not exist', async () => {
        mockUseCase.run.mockRejectedValue(new Error('Receita não encontrada'))
        const controller = saveFavoriteController(mockUseCase)
        const result = await controller.handle({ body: { idRecipe: 99 }, userId: 1 })
        expect(result.statusCode).toBe(404)
    })

    it('returns 200 with success message on first save', async () => {
        mockUseCase.run.mockResolvedValue({ message: 'Receita favoritada com sucesso' })
        const controller = saveFavoriteController(mockUseCase)
        const result = await controller.handle({ body: { idRecipe: 42 }, userId: 1 })
        expect(result.statusCode).toBe(200)
        expect(result.body).toEqual({ message: 'Receita favoritada com sucesso' })
    })

    it('returns 200 with already_exists message on duplicate', async () => {
        mockUseCase.run.mockResolvedValue({ message: 'Receita já está nos favoritos' })
        const controller = saveFavoriteController(mockUseCase)
        const result = await controller.handle({ body: { idRecipe: 42 }, userId: 1 })
        expect(result.statusCode).toBe(200)
        expect(result.body).toEqual({ message: 'Receita já está nos favoritos' })
    })

    it('calls use-case with correct idUser and idRecipe', async () => {
        mockUseCase.run.mockResolvedValue({ message: 'Receita favoritada com sucesso' })
        const controller = saveFavoriteController(mockUseCase)
        await controller.handle({ body: { idRecipe: 42 }, userId: 7 })
        expect(mockUseCase.run).toHaveBeenCalledWith(7, 42)
    })

    it('returns 500 on unexpected error', async () => {
        mockUseCase.run.mockRejectedValue(new Error('db connection lost'))
        const controller = saveFavoriteController(mockUseCase)
        const result = await controller.handle({ body: { idRecipe: 42 }, userId: 1 })
        expect(result.statusCode).toBe(500)
    })
})
