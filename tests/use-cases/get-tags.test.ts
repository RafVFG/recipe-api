import { getTags } from "../../src/use-cases/get-tags";

const mockTagRepo = {
    findOrCreate: jest.fn(),
    getAll: jest.fn(),
    deleteById: jest.fn(),
};

beforeEach(() => jest.clearAllMocks());

describe("getTags", () => {
    it("returns all tags from repository", async () => {
        const fakeTags = [
            { id: 1, idUser: 1, name: "vegano" },
            { id: 2, idUser: 2, name: "rápido" },
        ];
        mockTagRepo.getAll.mockResolvedValue(fakeTags);

        const useCase = getTags(mockTagRepo);
        const result = await useCase.run();

        expect(result).toEqual(fakeTags);
        expect(mockTagRepo.getAll).toHaveBeenCalledTimes(1);
    });

    it("returns empty array when no tags exist", async () => {
        mockTagRepo.getAll.mockResolvedValue([]);

        const useCase = getTags(mockTagRepo);
        const result = await useCase.run();

        expect(result).toEqual([]);
    });
});
