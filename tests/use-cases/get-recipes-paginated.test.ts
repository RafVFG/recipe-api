import { getRecipesPaginated } from "../../src/use-cases/get-recipes/paginated";

const mockRepo = {
    createOrUpdate: jest.fn(),
    getAll: jest.fn(),
    getPaginated: jest.fn(),
    getById: jest.fn(),
    remove: jest.fn(),
    syncTags: jest.fn(),
    getTagsByRecipeId: jest.fn(),
    getByUser: jest.fn(),
};

const fakeRecipe = {
    id: 1, idUser: 1, name: "Frango Grelhado", description: null,
    directions: "[]", rating: null, prepTime: null, yields: null,
    created_at: "2024-01-01", updated_at: "2024-01-01",
    ingredients: [], photos: [], tags: [],
};

beforeEach(() => jest.clearAllMocks());

describe("getRecipesPaginated", () => {
    it("calls getPaginated with filters, page and pageSize", async () => {
        mockRepo.getPaginated.mockResolvedValue({ recipes: [], total: 0 });
        const useCase = getRecipesPaginated(mockRepo);
        await useCase.run({ name: "frango" }, 2, 10);
        expect(mockRepo.getPaginated).toHaveBeenCalledWith({ name: "frango" }, 2, 10);
    });

    it("calls getPaginated with undefined filters when none provided", async () => {
        mockRepo.getPaginated.mockResolvedValue({ recipes: [], total: 0 });
        const useCase = getRecipesPaginated(mockRepo);
        await useCase.run(undefined, 1, 12);
        expect(mockRepo.getPaginated).toHaveBeenCalledWith(undefined, 1, 12);
    });

    it("enriches recipes with tags from repository", async () => {
        mockRepo.getPaginated.mockResolvedValue({ recipes: [fakeRecipe], total: 1 });
        mockRepo.getTagsByRecipeId.mockResolvedValue(["vegano"]);
        const useCase = getRecipesPaginated(mockRepo);
        const result = await useCase.run(undefined, 1, 12);
        expect(result.recipes[0].tags).toEqual(["vegano"]);
        expect(mockRepo.getTagsByRecipeId).toHaveBeenCalledWith(1);
    });

    it("returns total from repository", async () => {
        mockRepo.getPaginated.mockResolvedValue({ recipes: [], total: 42 });
        const useCase = getRecipesPaginated(mockRepo);
        const result = await useCase.run(undefined, 1, 12);
        expect(result.total).toBe(42);
    });

    it("returns empty recipes array when no results", async () => {
        mockRepo.getPaginated.mockResolvedValue({ recipes: [], total: 0 });
        const useCase = getRecipesPaginated(mockRepo);
        const result = await useCase.run({ name: "inexistente" }, 1, 12);
        expect(result.recipes).toEqual([]);
        expect(result.total).toBe(0);
    });
});
