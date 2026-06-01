import { userProfileController } from '../../../../src/adapters/controllers/user/profile'

const mockUseCase = { run: jest.fn() }

beforeEach(() => jest.clearAllMocks())

describe('userProfileController', () => {
    it('returns 401 when userId is missing', async () => {
        const controller = userProfileController(mockUseCase)
        const result = await controller.handle({ userId: undefined })
        expect(result.statusCode).toBe(401)
        expect(mockUseCase.run).not.toHaveBeenCalled()
    })

    it('returns 200 with profile on success', async () => {
        const fakeProfile = {
            id: 1, name: 'Rafael', email: 'r@r.com',
            recipesCount: 3, favoritesCount: 2,
        }
        mockUseCase.run.mockResolvedValue(fakeProfile)
        const controller = userProfileController(mockUseCase)
        const result = await controller.handle({ userId: 1 })
        expect(result.statusCode).toBe(200)
        expect(result.body).toEqual(fakeProfile)
        expect(mockUseCase.run).toHaveBeenCalledWith(1)
    })

    it('returns 404 when user not found', async () => {
        mockUseCase.run.mockRejectedValue(new Error('Usuário não encontrado'))
        const controller = userProfileController(mockUseCase)
        const result = await controller.handle({ userId: 99 })
        expect(result.statusCode).toBe(404)
        expect(result.body).toBe('Usuário não encontrado')
    })

    it('returns 500 on unexpected error', async () => {
        mockUseCase.run.mockRejectedValue(new Error('db error'))
        const controller = userProfileController(mockUseCase)
        const result = await controller.handle({ userId: 1 })
        expect(result.statusCode).toBe(500)
    })
})
