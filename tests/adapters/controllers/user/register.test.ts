import { registerController } from "../../../../src/adapters/controllers/user/register";

const mockUseCase = { run: jest.fn() };

beforeEach(() => jest.clearAllMocks());

describe("registerController", () => {
    it("returns 400 when name is missing", async () => {
        const controller = registerController(mockUseCase);
        const result = await controller.handle({ body: { email: "a@b.com" } });
        expect(result.statusCode).toBe(400);
    });

    it("returns 400 when name is empty string", async () => {
        const controller = registerController(mockUseCase);
        const result = await controller.handle({ body: { name: "  ", email: "a@b.com" } });
        expect(result.statusCode).toBe(400);
    });

    it("returns 400 when email is missing", async () => {
        const controller = registerController(mockUseCase);
        const result = await controller.handle({ body: { name: "Ana" } });
        expect(result.statusCode).toBe(400);
    });

    it("returns 400 when email has no @", async () => {
        const controller = registerController(mockUseCase);
        const result = await controller.handle({ body: { name: "Ana", email: "invalido" } });
        expect(result.statusCode).toBe(400);
    });

    it("returns 409 when email already exists", async () => {
        mockUseCase.run.mockRejectedValue(new Error("Email já cadastrado"));
        const controller = registerController(mockUseCase);
        const result = await controller.handle({ body: { name: "Ana", email: "ana@test.com" } });
        expect(result.statusCode).toBe(409);
        expect(result.body).toBe("Email já cadastrado");
    });

    it("returns 201 on success", async () => {
        mockUseCase.run.mockResolvedValue(undefined);
        const controller = registerController(mockUseCase);
        const result = await controller.handle({ body: { name: "Ana", email: "ana@test.com" } });
        expect(result.statusCode).toBe(201);
    });

    it("calls use case with trimmed name and email", async () => {
        mockUseCase.run.mockResolvedValue(undefined);
        const controller = registerController(mockUseCase);
        await controller.handle({ body: { name: "  Ana  ", email: "  ana@test.com  " } });
        expect(mockUseCase.run).toHaveBeenCalledWith("Ana", "ana@test.com");
    });

    it("returns 500 on unexpected error", async () => {
        mockUseCase.run.mockRejectedValue(new Error("db error"));
        const controller = registerController(mockUseCase);
        const result = await controller.handle({ body: { name: "Ana", email: "ana@test.com" } });
        expect(result.statusCode).toBe(500);
    });
});
