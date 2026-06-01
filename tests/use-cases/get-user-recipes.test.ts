import { getUserRecipes } from '../../src/use-cases/get-user-recipes'

const mockRepo = {
    createOrUpdate: jest.fn(),
    getAll: jest.fn(),
    getPaginated: jest.fn(),
    getById: jest.fn(),
    remove: jest.fn(),
    syncTags: jest.fn(),
    getTagsByRecipeId: jest.fn(),
    getByUser: jest.fn(),
}

beforeEach(() => jest.clearAllMocks())

describe('getUserRecipes', () => {
    it('returns recipes for the user enriched with tags', async () => {
        const fakeRecipes = [
            { id: 1, idUser: 5, name: 'Bolo', directions: '[]', description: null,
              rating: null, prepTime: null, yields: null, created_at: '', updated_at: '',
              ingredients: [], photos: [], tags: [] },
        ]
        mockRepo.getByUser.mockResolvedValue(fakeRecipes)
        mockRepo.getTagsByRecipeId.mockResolvedValue(['sobremesa'])

        const useCase = getUserRecipes(mockRepo)
        const result = await useCase.run(5)

        expect(mockRepo.getByUser).toHaveBeenCalledWith(5)
        expect(mockRepo.getTagsByRecipeId).toHaveBeenCalledWith(1)
        expect(result[0].tags).toEqual(['sobremesa'])
    })

    it('returns empty array when user has no recipes', async () => {
        mockRepo.getByUser.mockResolvedValue([])

        const useCase = getUserRecipes(mockRepo)
        const result = await useCase.run(5)

        expect(result).toEqual([])
        expect(mockRepo.getTagsByRecipeId).not.toHaveBeenCalled()
    })
})
