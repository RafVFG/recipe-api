import { recipeListController } from "../../../../src/adapters/controllers/recipe/list";

const mockUseCase = { run: jest.fn() };

beforeEach(() => jest.clearAllMocks());

describe("recipeListController", () => {
    it("passes name filter from query", async () => {
        mockUseCase.run.mockResolvedValue([]);
        const controller = recipeListController(mockUseCase);
        await controller.handle({ query: { name: "frango" } });
        expect(mockUseCase.run).toHaveBeenCalledWith({
            name: "frango", ingredient: undefined, tags: undefined, prepTime: undefined,
        });
    });

    it("splits tags by comma", async () => {
        mockUseCase.run.mockResolvedValue([]);
        const controller = recipeListController(mockUseCase);
        await controller.handle({ query: { tags: "almoco,rapido" } });
        expect(mockUseCase.run).toHaveBeenCalledWith({
            name: undefined, ingredient: undefined, tags: ["almoco", "rapido"], prepTime: undefined,
        });
    });

    it("trims whitespace from tags", async () => {
        mockUseCase.run.mockResolvedValue([]);
        const controller = recipeListController(mockUseCase);
        await controller.handle({ query: { tags: "almoco, rapido" } });
        expect(mockUseCase.run).toHaveBeenCalledWith({
            name: undefined, ingredient: undefined, tags: ["almoco", "rapido"], prepTime: undefined,
        });
    });

    it("parses prepTime as integer", async () => {
        mockUseCase.run.mockResolvedValue([]);
        const controller = recipeListController(mockUseCase);
        await controller.handle({ query: { prepTime: "30" } });
        expect(mockUseCase.run).toHaveBeenCalledWith({
            name: undefined, ingredient: undefined, tags: undefined, prepTime: 30,
        });
    });

    it("discards prepTime when value is not a valid number", async () => {
        mockUseCase.run.mockResolvedValue([]);
        const controller = recipeListController(mockUseCase);
        await controller.handle({ query: { prepTime: "abc" } });
        expect(mockUseCase.run).toHaveBeenCalledWith({
            name: undefined, ingredient: undefined, tags: undefined, prepTime: undefined,
        });
    });

    it("passes all filters combined", async () => {
        mockUseCase.run.mockResolvedValue([]);
        const controller = recipeListController(mockUseCase);
        await controller.handle({ query: { name: "frango", tags: "almoco,rapido", prepTime: "30", ingredient: "tomate" } });
        expect(mockUseCase.run).toHaveBeenCalledWith({
            name: "frango", ingredient: "tomate", tags: ["almoco", "rapido"], prepTime: 30,
        });
    });

    it("returns 200 with recipes on success", async () => {
        const fakeRecipes = [{ id: 1, name: "Frango Grelhado" }];
        mockUseCase.run.mockResolvedValue(fakeRecipes);
        const controller = recipeListController(mockUseCase);
        const result = await controller.handle({ query: {} });
        expect(result.statusCode).toBe(200);
        expect(result.body).toEqual(fakeRecipes);
    });

    it("returns 500 when use case throws", async () => {
        mockUseCase.run.mockRejectedValue(new Error("db error"));
        const controller = recipeListController(mockUseCase);
        const result = await controller.handle({ query: {} });
        expect(result.statusCode).toBe(500);
    });
});
