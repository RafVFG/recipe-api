import { getRecipes } from "../../src/use-cases/get-recipes";

const mockRepo = {
    createOrUpdate: jest.fn(),
    getAll: jest.fn(),
    getById: jest.fn(),
    remove: jest.fn(),
    syncTags: jest.fn(),
    getTagsByRecipeId: jest.fn(),
};

const fakeRecipe = {
    id: 1, idUser: 1, name: "Frango Grelhado", description: null,
    directions: "[]", rating: null, prepTime: null, yields: null,
    created_at: "2024-01-01", updated_at: "2024-01-01",
    ingredients: [], photos: [], tags: [],
};

beforeEach(() => jest.clearAllMocks());

describe("getRecipes", () => {
    it("passes name filter to repository", async () => {
        mockRepo.getAll.mockResolvedValue([]);
        const useCase = getRecipes(mockRepo);
        await useCase.run({ name: "frango" });
        expect(mockRepo.getAll).toHaveBeenCalledWith({ name: "frango" });
    });

    it("passes tags filter to repository", async () => {
        mockRepo.getAll.mockResolvedValue([]);
        const useCase = getRecipes(mockRepo);
        await useCase.run({ tags: ["almoco", "rapido"] });
        expect(mockRepo.getAll).toHaveBeenCalledWith({ tags: ["almoco", "rapido"] });
    });

    it("passes prepTime filter to repository", async () => {
        mockRepo.getAll.mockResolvedValue([]);
        const useCase = getRecipes(mockRepo);
        await useCase.run({ prepTime: 30 });
        expect(mockRepo.getAll).toHaveBeenCalledWith({ prepTime: 30 });
    });

    it("passes combined filters to repository", async () => {
        mockRepo.getAll.mockResolvedValue([]);
        const useCase = getRecipes(mockRepo);
        await useCase.run({ name: "frango", tags: ["almoco"], ingredient: "tomate", prepTime: 30 });
        expect(mockRepo.getAll).toHaveBeenCalledWith({ name: "frango", tags: ["almoco"], ingredient: "tomate", prepTime: 30 });
    });

    it("enriches recipes with tags from repository", async () => {
        mockRepo.getAll.mockResolvedValue([fakeRecipe]);
        mockRepo.getTagsByRecipeId.mockResolvedValue(["vegano"]);
        const useCase = getRecipes(mockRepo);
        const result = await useCase.run();
        expect(result[0].tags).toEqual(["vegano"]);
        expect(mockRepo.getTagsByRecipeId).toHaveBeenCalledWith(1);
    });

    it("returns empty array when no recipes found", async () => {
        mockRepo.getAll.mockResolvedValue([]);
        const useCase = getRecipes(mockRepo);
        const result = await useCase.run({ name: "inexistente" });
        expect(result).toEqual([]);
    });
});
