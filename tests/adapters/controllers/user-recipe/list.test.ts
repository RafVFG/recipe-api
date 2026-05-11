import { listFavoritesController } from '../../../../src/adapters/controllers/user-recipe/list'

const mockUseCase = { run: jest.fn() }

beforeEach(() => jest.clearAllMocks())

describe('listFavoritesController', () => {
    it('returns 200 with list of favorites', async () => {
        const fakeList = [
            { id: 1, name: 'Bolo de cenoura', prepTime: 30, primaryPhoto: '/uploads/bolo.jpg', tags: ['sobremesa'] }
        ]
        mockUseCase.run.mockResolvedValue(fakeList)

        const controller = listFavoritesController(mockUseCase)
        const result = await controller.handle({ userId: 5 })

        expect(result.statusCode).toBe(200)
        expect(result.body).toEqual(fakeList)
    })

    it('returns 200 with empty array when user has no favorites', async () => {
        mockUseCase.run.mockResolvedValue([])

        const controller = listFavoritesController(mockUseCase)
        const result = await controller.handle({ userId: 5 })

        expect(result.statusCode).toBe(200)
        expect(result.body).toEqual([])
    })

    it('calls use-case with correct userId', async () => {
        mockUseCase.run.mockResolvedValue([])

        const controller = listFavoritesController(mockUseCase)
        await controller.handle({ userId: 9 })

        expect(mockUseCase.run).toHaveBeenCalledWith(9)
    })

    it('returns 500 on unexpected error', async () => {
        mockUseCase.run.mockRejectedValue(new Error('db error'))

        const controller = listFavoritesController(mockUseCase)
        const result = await controller.handle({ userId: 5 })

        expect(result.statusCode).toBe(500)
    })
})
