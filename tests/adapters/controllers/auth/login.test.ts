import { loginController } from "../../../../src/adapters/controllers/auth/login";

const mockUseCase = { run: jest.fn() };

beforeEach(() => {
    jest.clearAllMocks();
    mockUseCase.run.mockResolvedValue({ jwt: "token.jwt.here" });
});

describe("loginController", () => {
    it("returns 400 when email is missing", async () => {
        const ctrl = loginController(mockUseCase);
        const result = await ctrl.handle({ body: { password: "abc" }, query: {} });
        expect(result.statusCode).toBe(400);
    });

    it("returns 400 when email has no @", async () => {
        const ctrl = loginController(mockUseCase);
        const result = await ctrl.handle({ body: { email: "invalido", password: "abc" }, query: {} });
        expect(result.statusCode).toBe(400);
    });

    it("returns 400 when password is missing", async () => {
        const ctrl = loginController(mockUseCase);
        const result = await ctrl.handle({ body: { email: "a@b.com" }, query: {} });
        expect(result.statusCode).toBe(400);
    });

    it("returns 401 when use case throws invalid credentials", async () => {
        mockUseCase.run.mockRejectedValue(new Error("Email ou senha inválidos"));
        const ctrl = loginController(mockUseCase);
        const result = await ctrl.handle({ body: { email: "a@b.com", password: "errada" }, query: {} });
        expect(result.statusCode).toBe(401);
        expect(result.body).toBe("Email ou senha inválidos");
    });

    it("returns 200 with jwt on success", async () => {
        const ctrl = loginController(mockUseCase);
        const result = await ctrl.handle({ body: { email: "a@b.com", password: "certa" }, query: {} });
        expect(result.statusCode).toBe(200);
        expect(result.body).toEqual({ jwt: "token.jwt.here" });
    });

    it("calls use case with trimmed email", async () => {
        const ctrl = loginController(mockUseCase);
        await ctrl.handle({ body: { email: "  a@b.com  ", password: "senha" }, query: {} });
        expect(mockUseCase.run).toHaveBeenCalledWith("a@b.com", "senha");
    });
});
