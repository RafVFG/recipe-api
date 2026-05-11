import { removeFavorite } from '../../src/use-cases/remove-favorite'

const mockRepo = {
    save: jest.fn(),
    remove: jest.fn(),
    findAll: jest.fn(),
    recipeExists: jest.fn(),
}

beforeEach(() => jest.clearAllMocks())

describe('removeFavorite', () => {
    it('resolves when favorite is successfully removed', async () => {
        mockRepo.remove.mockResolvedValue('removed')

        const useCase = removeFavorite(mockRepo)
        await expect(useCase.run(1, 42)).resolves.toBeUndefined()
        expect(mockRepo.remove).toHaveBeenCalledWith(1, 42)
    })

    it('throws when favorite is not found', async () => {
        mockRepo.remove.mockResolvedValue('not_found')

        const useCase = removeFavorite(mockRepo)
        await expect(useCase.run(1, 99)).rejects.toThrow('Favorito não encontrado')
    })
})
