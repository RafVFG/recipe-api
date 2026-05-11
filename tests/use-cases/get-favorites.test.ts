import { getFavorites } from '../../src/use-cases/get-favorites'

const mockRepo = {
    save: jest.fn(),
    remove: jest.fn(),
    findAll: jest.fn(),
    recipeExists: jest.fn(),
}

beforeEach(() => jest.clearAllMocks())

describe('getFavorites', () => {
    it('returns list of favorites for the user', async () => {
        const fakeList = [
            { id: 1, name: 'Bolo de cenoura', prepTime: 30, primaryPhoto: '/uploads/bolo.jpg', tags: ['sobremesa'] },
            { id: 2, name: 'Frango grelhado', prepTime: 20, primaryPhoto: null, tags: [] },
        ]
        mockRepo.findAll.mockResolvedValue(fakeList)

        const useCase = getFavorites(mockRepo)
        const result = await useCase.run(5)

        expect(result).toEqual(fakeList)
        expect(mockRepo.findAll).toHaveBeenCalledWith(5)
    })

    it('returns empty array when user has no favorites', async () => {
        mockRepo.findAll.mockResolvedValue([])

        const useCase = getFavorites(mockRepo)
        const result = await useCase.run(5)

        expect(result).toEqual([])
    })
})
