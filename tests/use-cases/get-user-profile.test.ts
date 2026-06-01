import { getUserProfile } from '../../src/use-cases/get-user-profile'
import { UserProfile } from '../../src/entities/user/interfaces/user'
import { UserRepositoryMethods } from '../../src/repositories/user/interfaces/methods'

const mockFindById = jest.fn()
const mockRepo = { findById: mockFindById } as unknown as UserRepositoryMethods

beforeEach(() => jest.clearAllMocks())

describe('getUserProfile', () => {
    it('returns profile when user exists', async () => {
        const fakeProfile: UserProfile = {
            id: 1, name: 'Rafael', email: 'r@r.com',
            recipesCount: 3, favoritesCount: 2,
        }
        mockFindById.mockResolvedValue(fakeProfile)

        const useCase = getUserProfile(mockRepo)
        const result = await useCase.run(1)

        expect(mockFindById).toHaveBeenCalledWith(1)
        expect(result).toEqual(fakeProfile)
    })

    it('throws when user not found', async () => {
        mockFindById.mockResolvedValue(null)

        const useCase = getUserProfile(mockRepo)
        await expect(useCase.run(99)).rejects.toThrow('Usuário não encontrado')
    })
})
