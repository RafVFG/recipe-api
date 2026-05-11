import { removeFavoriteController } from '../../../../src/adapters/controllers/user-recipe/remove'

const mockUseCase = { run: jest.fn() }

beforeEach(() => jest.clearAllMocks())

describe('removeFavoriteController', () => {
    it('returns 400 when idRecipe param is missing', async () => {
        const controller = removeFavoriteController(mockUseCase)
        const result = await controller.handle({ params: {}, userId: 1 })
        expect(result.statusCode).toBe(400)
    })

    it('returns 400 when idRecipe param is not a number', async () => {
        const controller = removeFavoriteController(mockUseCase)
        const result = await controller.handle({ params: { idRecipe: 'abc' }, userId: 1 })
        expect(result.statusCode).toBe(400)
    })

    it('returns 404 when favorite is not found', async () => {
        mockUseCase.run.mockRejectedValue(new Error('Favorito não encontrado'))
        const controller = removeFavoriteController(mockUseCase)
        const result = await controller.handle({ params: { idRecipe: '99' }, userId: 1 })
        expect(result.statusCode).toBe(404)
    })

    it('returns 200 with message on success', async () => {
        mockUseCase.run.mockResolvedValue(undefined)
        const controller = removeFavoriteController(mockUseCase)
        const result = await controller.handle({ params: { idRecipe: '42' }, userId: 1 })
        expect(result.statusCode).toBe(200)
        expect(result.body).toEqual({ message: 'Receita removida dos favoritos' })
    })

    it('calls use-case with correct idUser and idRecipe', async () => {
        mockUseCase.run.mockResolvedValue(undefined)
        const controller = removeFavoriteController(mockUseCase)
        await controller.handle({ params: { idRecipe: '42' }, userId: 7 })
        expect(mockUseCase.run).toHaveBeenCalledWith(7, 42)
    })

    it('returns 500 on unexpected error', async () => {
        mockUseCase.run.mockRejectedValue(new Error('db timeout'))
        const controller = removeFavoriteController(mockUseCase)
        const result = await controller.handle({ params: { idRecipe: '42' }, userId: 1 })
        expect(result.statusCode).toBe(500)
    })
})
