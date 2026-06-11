import crypto from "crypto";
import { verifyMagicLink } from "../../src/use-cases/verify-magic-link";

const mockAuthTokenRepo = {
    create: jest.fn(),
    findByHash: jest.fn(),
    deleteByHash: jest.fn(),
};

const RAW_TOKEN = "abc123";
const HASH = crypto.createHash("sha256").update(RAW_TOKEN).digest("hex");

beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = "test-secret";
});

describe("verifyMagicLink", () => {
    it("throws 'Token inválido' when token not found", async () => {
        mockAuthTokenRepo.findByHash.mockResolvedValue(null);

        const useCase = verifyMagicLink(mockAuthTokenRepo);
        await expect(useCase.run(RAW_TOKEN)).rejects.toThrow("Token inválido");

        expect(mockAuthTokenRepo.findByHash).toHaveBeenCalledWith(HASH, 'magic_link');
    });

    it("throws 'Link expirado' when token is expired", async () => {
        const expired = new Date();
        expired.setMinutes(expired.getMinutes() - 1);

        mockAuthTokenRepo.findByHash.mockResolvedValue({
            id: 1, idUser: 42, hash: HASH, type: 'magic_link', expires_at: expired,
        });

        const useCase = verifyMagicLink(mockAuthTokenRepo);
        await expect(useCase.run(RAW_TOKEN)).rejects.toThrow("Link expirado");
    });

    it("returns jwt and deletes token on valid token", async () => {
        const future = new Date();
        future.setMinutes(future.getMinutes() + 10);

        mockAuthTokenRepo.findByHash.mockResolvedValue({
            id: 1, idUser: 42, hash: HASH, type: 'magic_link', expires_at: future,
        });
        mockAuthTokenRepo.deleteByHash.mockResolvedValue(undefined);

        const useCase = verifyMagicLink(mockAuthTokenRepo);
        const result = await useCase.run(RAW_TOKEN);

        expect(typeof result.jwt).toBe("string");
        expect(result.jwt.split(".").length).toBe(3);
        expect(mockAuthTokenRepo.deleteByHash).toHaveBeenCalledWith(HASH);
    });
});
