import { saveFavorite } from '../../src/use-cases/save-favorite'

const mockRepo = {
    save: jest.fn(),
    remove: jest.fn(),
    findAll: jest.fn(),
    recipeExists: jest.fn(),
}

beforeEach(() => jest.clearAllMocks())

describe('saveFavorite', () => {
    it('returns success message when recipe is saved for the first time', async () => {
        mockRepo.recipeExists.mockResolvedValue(true)
        mockRepo.save.mockResolvedValue('saved')

        const useCase = saveFavorite(mockRepo)
        const result = await useCase.run(1, 42)

        expect(result).toEqual({ message: 'Receita favoritada com sucesso' })
        expect(mockRepo.save).toHaveBeenCalledWith(1, 42)
    })

    it('returns already_exists message when recipe is already favorited', async () => {
        mockRepo.recipeExists.mockResolvedValue(true)
        mockRepo.save.mockResolvedValue('already_exists')

        const useCase = saveFavorite(mockRepo)
        const result = await useCase.run(1, 42)

        expect(result).toEqual({ message: 'Receita já está nos favoritos' })
    })

    it('throws when recipe does not exist', async () => {
        mockRepo.recipeExists.mockResolvedValue(false)

        const useCase = saveFavorite(mockRepo)
        await expect(useCase.run(1, 99)).rejects.toThrow('Receita não encontrada')
        expect(mockRepo.save).not.toHaveBeenCalled()
    })
})
