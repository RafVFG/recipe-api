import { delTag } from "../../src/use-cases/del-tag";

const mockTagRepo = {
    findOrCreate: jest.fn(),
    getAll: jest.fn(),
    deleteById: jest.fn(),
};

beforeEach(() => jest.clearAllMocks());

describe("delTag", () => {
    it("deletes successfully when idUser matches", async () => {
        mockTagRepo.deleteById.mockResolvedValue(true);

        const useCase = delTag(mockTagRepo);
        await expect(useCase.run(1, 42)).resolves.toBeUndefined();
        expect(mockTagRepo.deleteById).toHaveBeenCalledWith(1, 42);
    });

    it("throws when tag not found or user is not owner", async () => {
        mockTagRepo.deleteById.mockResolvedValue(false);

        const useCase = delTag(mockTagRepo);
        await expect(useCase.run(1, 99)).rejects.toThrow("Tag não encontrada ou sem permissão");
    });
});
