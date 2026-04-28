import { requestMagicLink } from "../../src/use-cases/request-magic-link";

const mockUserRepo = {
    findByEmail: jest.fn(),
};

const mockAuthTokenRepo = {
    create: jest.fn(),
    findByHash: jest.fn(),
    deleteByHash: jest.fn(),
};

const mockEmailSender = {
    send: jest.fn(),
};

beforeEach(() => {
    jest.clearAllMocks();
});

describe("requestMagicLink", () => {
    it("throws 'Email não encontrado' when user does not exist", async () => {
        mockUserRepo.findByEmail.mockResolvedValue(null);

        const useCase = requestMagicLink(mockUserRepo, mockAuthTokenRepo, mockEmailSender);

        await expect(useCase.run("nao@existe.com")).rejects.toThrow("Email não encontrado");
    });

    it("creates token and sends email when user exists", async () => {
        mockUserRepo.findByEmail.mockResolvedValue({ id: 1, name: "João", email: "joao@test.com" });
        mockAuthTokenRepo.create.mockResolvedValue(undefined);
        mockEmailSender.send.mockResolvedValue(undefined);

        const useCase = requestMagicLink(mockUserRepo, mockAuthTokenRepo, mockEmailSender);
        await useCase.run("joao@test.com");

        expect(mockAuthTokenRepo.create).toHaveBeenCalledWith(
            expect.objectContaining({ idUser: 1 })
        );
        expect(mockEmailSender.send).toHaveBeenCalledWith(
            expect.objectContaining({ to: "joao@test.com" })
        );
    });

    it("token expires in approximately 15 minutes", async () => {
        mockUserRepo.findByEmail.mockResolvedValue({ id: 1, name: "João", email: "joao@test.com" });
        mockAuthTokenRepo.create.mockResolvedValue(undefined);
        mockEmailSender.send.mockResolvedValue(undefined);

        const before = new Date();
        const useCase = requestMagicLink(mockUserRepo, mockAuthTokenRepo, mockEmailSender);
        await useCase.run("joao@test.com");

        const call = mockAuthTokenRepo.create.mock.calls[0][0];
        const diffMs = call.expiresAt.getTime() - before.getTime();
        const diffMin = diffMs / 1000 / 60;

        expect(diffMin).toBeGreaterThanOrEqual(14);
        expect(diffMin).toBeLessThanOrEqual(16);
    });
});
