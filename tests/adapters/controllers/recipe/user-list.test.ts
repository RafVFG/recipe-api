import { userRecipeListController } from '../../../../src/adapters/controllers/recipe/user-list'

const mockUseCase = { run: jest.fn() }

beforeEach(() => jest.clearAllMocks())

describe('userRecipeListController', () => {
    it('returns 401 when userId is missing', async () => {
        const controller = userRecipeListController(mockUseCase)
        const result = await controller.handle({ userId: undefined })
        expect(result.statusCode).toBe(401)
        expect(mockUseCase.run).not.toHaveBeenCalled()
    })

    it('returns 200 with recipes on success', async () => {
        const fakeRecipes = [{ id: 1, name: 'Bolo' }]
        mockUseCase.run.mockResolvedValue(fakeRecipes)
        const controller = userRecipeListController(mockUseCase)
        const result = await controller.handle({ userId: 5 })
        expect(result.statusCode).toBe(200)
        expect(result.body).toEqual(fakeRecipes)
        expect(mockUseCase.run).toHaveBeenCalledWith(5)
    })

    it('returns 500 when use case throws', async () => {
        mockUseCase.run.mockRejectedValue(new Error('db error'))
        const controller = userRecipeListController(mockUseCase)
        const result = await controller.handle({ userId: 5 })
        expect(result.statusCode).toBe(500)
    })
})
