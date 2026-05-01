import { deleteRecipePhoto } from '../../src/use-cases/delete-recipe-photo'

jest.mock('fs/promises', () => ({
    unlink: jest.fn().mockResolvedValue(undefined)
}))

import { unlink } from 'fs/promises'
const mockUnlink = unlink as jest.Mock

const mockPhotoRepo = {
    add: jest.fn(),
    remove: jest.fn(),
    findById: jest.fn(),
    promotePrimary: jest.fn(),
}

beforeEach(() => {
    jest.clearAllMocks()
    mockUnlink.mockResolvedValue(undefined)
})

describe('deleteRecipePhoto', () => {
    it('removes file from disk and record from db when photo exists', async () => {
        mockPhotoRepo.findById.mockResolvedValue({
            id: 1, idRecipe: 5, url: '/uploads/photo.jpg', isPrimary: 0
        })
        mockPhotoRepo.remove.mockResolvedValue(undefined)

        const useCase = deleteRecipePhoto(mockPhotoRepo)
        await expect(useCase.run(1)).resolves.toBeUndefined()

        expect(mockPhotoRepo.findById).toHaveBeenCalledWith(1)
        expect(mockUnlink).toHaveBeenCalled()
        expect(mockPhotoRepo.remove).toHaveBeenCalledWith(1)
    })

    it('throws when photo is not found', async () => {
        mockPhotoRepo.findById.mockResolvedValue(null)

        const useCase = deleteRecipePhoto(mockPhotoRepo)
        await expect(useCase.run(99)).rejects.toThrow('Foto não encontrada')
        expect(mockPhotoRepo.remove).not.toHaveBeenCalled()
    })

    it('still removes db record when file does not exist on disk (ENOENT)', async () => {
        mockPhotoRepo.findById.mockResolvedValue({
            id: 1, idRecipe: 5, url: '/uploads/photo.jpg', isPrimary: 0
        })
        mockPhotoRepo.remove.mockResolvedValue(undefined)
        const enoentError = Object.assign(new Error('no such file'), { code: 'ENOENT' })
        mockUnlink.mockRejectedValue(enoentError)

        const useCase = deleteRecipePhoto(mockPhotoRepo)
        await expect(useCase.run(1)).resolves.toBeUndefined()
        expect(mockPhotoRepo.remove).toHaveBeenCalledWith(1)
    })

    it('propagates unexpected fs errors without touching the db', async () => {
        mockPhotoRepo.findById.mockResolvedValue({
            id: 1, idRecipe: 5, url: '/uploads/photo.jpg', isPrimary: 0
        })
        mockUnlink.mockRejectedValue(new Error('permission denied'))

        const useCase = deleteRecipePhoto(mockPhotoRepo)
        await expect(useCase.run(1)).rejects.toThrow('permission denied')
        expect(mockPhotoRepo.remove).not.toHaveBeenCalled()
    })

    it('promotes next photo when deleted photo was primary', async () => {
        mockPhotoRepo.findById.mockResolvedValue({
            id: 2, idRecipe: 5, url: '/uploads/primary.jpg', isPrimary: 1
        })
        mockPhotoRepo.remove.mockResolvedValue(undefined)
        mockPhotoRepo.promotePrimary.mockResolvedValue(undefined)

        const useCase = deleteRecipePhoto(mockPhotoRepo)
        await useCase.run(2)

        expect(mockPhotoRepo.promotePrimary).toHaveBeenCalledWith(5)
    })

    it('does not promote when deleted photo was not primary', async () => {
        mockPhotoRepo.findById.mockResolvedValue({
            id: 3, idRecipe: 5, url: '/uploads/secondary.jpg', isPrimary: 0
        })
        mockPhotoRepo.remove.mockResolvedValue(undefined)

        const useCase = deleteRecipePhoto(mockPhotoRepo)
        await useCase.run(3)

        expect(mockPhotoRepo.promotePrimary).not.toHaveBeenCalled()
    })
})
