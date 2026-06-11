import { forgotPasswordController } from "../../../../src/adapters/controllers/auth/forgot-password";

const mockUseCase = { run: jest.fn() };

beforeEach(() => {
    jest.clearAllMocks();
    mockUseCase.run.mockResolvedValue(undefined);
});

describe("forgotPasswordController", () => {
    it("returns 400 when email is missing", async () => {
        const ctrl = forgotPasswordController(mockUseCase);
        const result = await ctrl.handle({ body: {}, query: {} });
        expect(result.statusCode).toBe(400);
    });

    it("returns 400 when email has no @", async () => {
        const ctrl = forgotPasswordController(mockUseCase);
        const result = await ctrl.handle({ body: { email: "invalido" }, query: {} });
        expect(result.statusCode).toBe(400);
    });

    it("returns 200 when user exists", async () => {
        const ctrl = forgotPasswordController(mockUseCase);
        const result = await ctrl.handle({ body: { email: "a@b.com" }, query: {} });
        expect(result.statusCode).toBe(200);
    });

    it("returns 200 even when use case does nothing (user not found)", async () => {
        mockUseCase.run.mockResolvedValue(undefined);
        const ctrl = forgotPasswordController(mockUseCase);
        const result = await ctrl.handle({ body: { email: "nao@existe.com" }, query: {} });
        expect(result.statusCode).toBe(200);
    });

    it("calls use case with trimmed email", async () => {
        const ctrl = forgotPasswordController(mockUseCase);
        await ctrl.handle({ body: { email: "  a@b.com  " }, query: {} });
        expect(mockUseCase.run).toHaveBeenCalledWith("a@b.com");
    });
});
