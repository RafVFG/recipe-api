import { resetPasswordController } from "../../../../src/adapters/controllers/auth/reset-password";

const mockUseCase = { run: jest.fn() };

beforeEach(() => {
    jest.clearAllMocks();
    mockUseCase.run.mockResolvedValue({ jwt: "token.jwt.here" });
});

describe("resetPasswordController", () => {
    it("returns 400 when token is missing", async () => {
        const ctrl = resetPasswordController(mockUseCase);
        const result = await ctrl.handle({ body: { newPassword: "abc" }, query: {} });
        expect(result.statusCode).toBe(400);
    });

    it("returns 400 when newPassword is missing", async () => {
        const ctrl = resetPasswordController(mockUseCase);
        const result = await ctrl.handle({ body: { token: "tok" }, query: {} });
        expect(result.statusCode).toBe(400);
    });

    it("returns 400 when use case throws invalid token", async () => {
        mockUseCase.run.mockRejectedValue(new Error("Token inválido ou expirado"));
        const ctrl = resetPasswordController(mockUseCase);
        const result = await ctrl.handle({ body: { token: "tok", newPassword: "abc" }, query: {} });
        expect(result.statusCode).toBe(400);
        expect(result.body).toBe("Token inválido ou expirado");
    });

    it("returns 200 with jwt on success", async () => {
        const ctrl = resetPasswordController(mockUseCase);
        const result = await ctrl.handle({ body: { token: "tok", newPassword: "abc" }, query: {} });
        expect(result.statusCode).toBe(200);
        expect(result.body).toEqual({ jwt: "token.jwt.here" });
    });
});
