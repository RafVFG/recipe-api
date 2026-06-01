import { createOrUpdateRecipe } from "../../src/use-cases/create-recipe";

const mockRecipeRepo = {
    createOrUpdate: jest.fn(),
    getAll: jest.fn(),
    getPaginated: jest.fn(),
    getById: jest.fn(),
    remove: jest.fn(),
    syncTags: jest.fn(),
    getTagsByRecipeId: jest.fn(),
    getByUser: jest.fn(),
};

const mockTagRepo = {
    findOrCreate: jest.fn(),
    getAll: jest.fn(),
    deleteById: jest.fn(),
};

const baseRecipe = {
    idUser: 1,
    name: "Bolo de Cenoura",
    ingredients: [{ name: "cenoura", amount: "2 unidades" }],
    directions: ["misture tudo", "leve ao forno"],
};

beforeEach(() => jest.clearAllMocks());

describe("createOrUpdateRecipe", () => {
    it("calls syncTags with resolved ids when tags are provided", async () => {
        mockRecipeRepo.createOrUpdate.mockResolvedValue(10);
        mockTagRepo.findOrCreate
            .mockResolvedValueOnce(1)
            .mockResolvedValueOnce(2);
        mockRecipeRepo.syncTags.mockResolvedValue(undefined);

        const useCase = createOrUpdateRecipe(mockRecipeRepo, mockTagRepo);
        await useCase.run({ ...baseRecipe, tags: ["vegano", "rápido"] });

        expect(mockTagRepo.findOrCreate).toHaveBeenCalledWith("vegano", 1);
        expect(mockTagRepo.findOrCreate).toHaveBeenCalledWith("rápido", 1);
        expect(mockRecipeRepo.syncTags).toHaveBeenCalledWith(10, [1, 2]);
    });

    it("calls syncTags with empty array when tags are not provided", async () => {
        mockRecipeRepo.createOrUpdate.mockResolvedValue(10);
        mockRecipeRepo.syncTags.mockResolvedValue(undefined);

        const useCase = createOrUpdateRecipe(mockRecipeRepo, mockTagRepo);
        await useCase.run({ ...baseRecipe });

        expect(mockTagRepo.findOrCreate).not.toHaveBeenCalled();
        expect(mockRecipeRepo.syncTags).toHaveBeenCalledWith(10, []);
    });

    it("calls syncTags with empty array when tags is empty array", async () => {
        mockRecipeRepo.createOrUpdate.mockResolvedValue(10);
        mockRecipeRepo.syncTags.mockResolvedValue(undefined);

        const useCase = createOrUpdateRecipe(mockRecipeRepo, mockTagRepo);
        await useCase.run({ ...baseRecipe, tags: [] });

        expect(mockTagRepo.findOrCreate).not.toHaveBeenCalled();
        expect(mockRecipeRepo.syncTags).toHaveBeenCalledWith(10, []);
    });
});
