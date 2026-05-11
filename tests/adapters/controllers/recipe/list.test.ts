import { recipeListController } from "../../../../src/adapters/controllers/recipe/list";

const mockUseCase = { run: jest.fn() };

const fakePaginatedResult = {
    recipes: [{ id: 1, name: "Frango Grelhado" }],
    total: 1,
};

beforeEach(() => jest.clearAllMocks());

describe("recipeListController", () => {
    it("passes name filter from query", async () => {
        mockUseCase.run.mockResolvedValue({ recipes: [], total: 0 });
        const controller = recipeListController(mockUseCase);
        await controller.handle({ query: { name: "frango" } });
        expect(mockUseCase.run).toHaveBeenCalledWith(
            { name: "frango", ingredient: undefined, tags: undefined, prepTime: undefined },
            1, 12
        );
    });

    it("splits tags by comma", async () => {
        mockUseCase.run.mockResolvedValue({ recipes: [], total: 0 });
        const controller = recipeListController(mockUseCase);
        await controller.handle({ query: { tags: "almoco,rapido" } });
        expect(mockUseCase.run).toHaveBeenCalledWith(
            { name: undefined, ingredient: undefined, tags: ["almoco", "rapido"], prepTime: undefined },
            1, 12
        );
    });

    it("trims whitespace from tags", async () => {
        mockUseCase.run.mockResolvedValue({ recipes: [], total: 0 });
        const controller = recipeListController(mockUseCase);
        await controller.handle({ query: { tags: "almoco, rapido" } });
        expect(mockUseCase.run).toHaveBeenCalledWith(
            { name: undefined, ingredient: undefined, tags: ["almoco", "rapido"], prepTime: undefined },
            1, 12
        );
    });

    it("parses prepTime as integer", async () => {
        mockUseCase.run.mockResolvedValue({ recipes: [], total: 0 });
        const controller = recipeListController(mockUseCase);
        await controller.handle({ query: { prepTime: "30" } });
        expect(mockUseCase.run).toHaveBeenCalledWith(
            { name: undefined, ingredient: undefined, tags: undefined, prepTime: 30 },
            1, 12
        );
    });

    it("discards prepTime when value is not a valid number", async () => {
        mockUseCase.run.mockResolvedValue({ recipes: [], total: 0 });
        const controller = recipeListController(mockUseCase);
        await controller.handle({ query: { prepTime: "abc" } });
        expect(mockUseCase.run).toHaveBeenCalledWith(
            { name: undefined, ingredient: undefined, tags: undefined, prepTime: undefined },
            1, 12
        );
    });

    it("passes all filters combined", async () => {
        mockUseCase.run.mockResolvedValue({ recipes: [], total: 0 });
        const controller = recipeListController(mockUseCase);
        await controller.handle({ query: { name: "frango", tags: "almoco,rapido", prepTime: "30", ingredient: "tomate" } });
        expect(mockUseCase.run).toHaveBeenCalledWith(
            { name: "frango", ingredient: "tomate", tags: ["almoco", "rapido"], prepTime: 30 },
            1, 12
        );
    });

    it("uses default page=1 and pageSize=12 when not provided", async () => {
        mockUseCase.run.mockResolvedValue({ recipes: [], total: 0 });
        const controller = recipeListController(mockUseCase);
        await controller.handle({ query: {} });
        expect(mockUseCase.run).toHaveBeenCalledWith(undefined, 1, 12);
    });

    it("passes custom page and pageSize", async () => {
        mockUseCase.run.mockResolvedValue({ recipes: [], total: 0 });
        const controller = recipeListController(mockUseCase);
        await controller.handle({ query: { page: "3", pageSize: "20" } });
        expect(mockUseCase.run).toHaveBeenCalledWith(undefined, 3, 20);
    });

    it("limits pageSize to 100 when value exceeds max", async () => {
        mockUseCase.run.mockResolvedValue({ recipes: [], total: 0 });
        const controller = recipeListController(mockUseCase);
        await controller.handle({ query: { pageSize: "5000" } });
        expect(mockUseCase.run).toHaveBeenCalledWith(undefined, 1, 100);
    });

    it("returns 400 when page is less than 1", async () => {
        const controller = recipeListController(mockUseCase);
        const result = await controller.handle({ query: { page: "0" } });
        expect(result.statusCode).toBe(400);
        expect(mockUseCase.run).not.toHaveBeenCalled();
    });

    it("returns 400 when page is negative", async () => {
        const controller = recipeListController(mockUseCase);
        const result = await controller.handle({ query: { page: "-1" } });
        expect(result.statusCode).toBe(400);
        expect(mockUseCase.run).not.toHaveBeenCalled();
    });

    it("returns 400 when pageSize is less than 1", async () => {
        const controller = recipeListController(mockUseCase);
        const result = await controller.handle({ query: { pageSize: "0" } });
        expect(result.statusCode).toBe(400);
        expect(mockUseCase.run).not.toHaveBeenCalled();
    });

    it("uses default page when page is not a valid number", async () => {
        mockUseCase.run.mockResolvedValue({ recipes: [], total: 0 });
        const controller = recipeListController(mockUseCase);
        await controller.handle({ query: { page: "abc" } });
        expect(mockUseCase.run).toHaveBeenCalledWith(undefined, 1, 12);
    });

    it("uses default pageSize when pageSize is not a valid number", async () => {
        mockUseCase.run.mockResolvedValue({ recipes: [], total: 0 });
        const controller = recipeListController(mockUseCase);
        await controller.handle({ query: { pageSize: "abc" } });
        expect(mockUseCase.run).toHaveBeenCalledWith(undefined, 1, 12);
    });

    it("returns 200 with paginated structure on success", async () => {
        mockUseCase.run.mockResolvedValue(fakePaginatedResult);
        const controller = recipeListController(mockUseCase);
        const result = await controller.handle({ query: { page: "1", pageSize: "12" } });
        expect(result.statusCode).toBe(200);
        expect(result.body).toEqual({
            data: [{ id: 1, name: "Frango Grelhado" }],
            pagination: { page: 1, pageSize: 12, total: 1, totalPages: 1 },
        });
    });

    it("calculates totalPages correctly", async () => {
        mockUseCase.run.mockResolvedValue({ recipes: [], total: 87 });
        const controller = recipeListController(mockUseCase);
        const result = await controller.handle({ query: { page: "2", pageSize: "10" } });
        expect(result.statusCode).toBe(200);
        expect(result.body.pagination).toEqual({ page: 2, pageSize: 10, total: 87, totalPages: 9 });
    });

    it("returns totalPages as 0 when total is 0", async () => {
        mockUseCase.run.mockResolvedValue({ recipes: [], total: 0 });
        const controller = recipeListController(mockUseCase);
        const result = await controller.handle({ query: {} });
        expect(result.body.pagination.totalPages).toBe(0);
    });

    it("returns 500 when use case throws", async () => {
        mockUseCase.run.mockRejectedValue(new Error("db error"));
        const controller = recipeListController(mockUseCase);
        const result = await controller.handle({ query: {} });
        expect(result.statusCode).toBe(500);
    });
});
