import crypto from "crypto";
import { resetPassword } from "../../src/use-cases/reset-password";

const RAW_TOKEN = "rawtoken123";
const HASH = crypto.createHash("sha256").update(RAW_TOKEN).digest("hex");

const mockUserRepo = {
    findByEmail: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
    updatePassword: jest.fn(),
};

const mockAuthTokenRepo = {
    create: jest.fn(),
    findByHash: jest.fn(),
    deleteByHash: jest.fn(),
};

beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = "test-secret";
    mockUserRepo.updatePassword.mockResolvedValue(undefined);
    mockAuthTokenRepo.deleteByHash.mockResolvedValue(undefined);
});

describe("resetPassword", () => {
    it("throws 'Token inválido ou expirado' when token not found", async () => {
        mockAuthTokenRepo.findByHash.mockResolvedValue(null);

        const useCase = resetPassword(mockUserRepo, mockAuthTokenRepo);
        await expect(useCase.run(RAW_TOKEN, "novaSenha")).rejects.toThrow("Token inválido ou expirado");

        expect(mockAuthTokenRepo.findByHash).toHaveBeenCalledWith(HASH, 'password_reset');
    });

    it("throws 'Token inválido ou expirado' when token is expired", async () => {
        const expired = new Date();
        expired.setMinutes(expired.getMinutes() - 1);

        mockAuthTokenRepo.findByHash.mockResolvedValue({
            id: 1, idUser: 10, hash: HASH, type: 'password_reset', expires_at: expired,
        });

        const useCase = resetPassword(mockUserRepo, mockAuthTokenRepo);
        await expect(useCase.run(RAW_TOKEN, "novaSenha")).rejects.toThrow("Token inválido ou expirado");
    });

    it("updates password with bcrypt hash and deletes token", async () => {
        const future = new Date();
        future.setMinutes(future.getMinutes() + 10);

        mockAuthTokenRepo.findByHash.mockResolvedValue({
            id: 1, idUser: 10, hash: HASH, type: 'password_reset', expires_at: future,
        });

        const useCase = resetPassword(mockUserRepo, mockAuthTokenRepo);
        await useCase.run(RAW_TOKEN, "novaSenha123");

        expect(mockUserRepo.updatePassword).toHaveBeenCalledWith(
            10,
            expect.stringMatching(/^\$2[ab]\$/)
        );
        expect(mockAuthTokenRepo.deleteByHash).toHaveBeenCalledWith(HASH);
    });

    it("returns jwt after successful reset", async () => {
        const future = new Date();
        future.setMinutes(future.getMinutes() + 10);

        mockAuthTokenRepo.findByHash.mockResolvedValue({
            id: 1, idUser: 10, hash: HASH, type: 'password_reset', expires_at: future,
        });

        const useCase = resetPassword(mockUserRepo, mockAuthTokenRepo);
        const result = await useCase.run(RAW_TOKEN, "novaSenha123");

        expect(typeof result.jwt).toBe("string");
        expect(result.jwt.split(".").length).toBe(3);
    });
});
