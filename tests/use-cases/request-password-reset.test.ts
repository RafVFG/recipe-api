import { requestPasswordReset } from "../../src/use-cases/request-password-reset";

process.env.FRONTEND_URL = "http://localhost:3333";

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

const mockEmailSender = { send: jest.fn() };

beforeEach(() => {
    jest.clearAllMocks();
    mockAuthTokenRepo.create.mockResolvedValue(undefined);
    mockEmailSender.send.mockResolvedValue(undefined);
});

describe("requestPasswordReset", () => {
    it("creates token with type password_reset and sends email when user exists", async () => {
        mockUserRepo.findByEmail.mockResolvedValue({ id: 7, name: "Ana", email: "a@b.com" });

        const useCase = requestPasswordReset(mockUserRepo, mockAuthTokenRepo, mockEmailSender);
        await useCase.run("a@b.com");

        expect(mockAuthTokenRepo.create).toHaveBeenCalledWith(
            expect.objectContaining({ idUser: 7, type: 'password_reset' })
        );
        expect(mockEmailSender.send).toHaveBeenCalledWith(
            expect.objectContaining({
                to: "a@b.com",
                html: expect.stringContaining("/nova-senha?token="),
            })
        );
    });

    it("does not throw and does not send email when user does not exist", async () => {
        mockUserRepo.findByEmail.mockResolvedValue(null);

        const useCase = requestPasswordReset(mockUserRepo, mockAuthTokenRepo, mockEmailSender);
        await expect(useCase.run("nao@existe.com")).resolves.toBeUndefined();

        expect(mockAuthTokenRepo.create).not.toHaveBeenCalled();
        expect(mockEmailSender.send).not.toHaveBeenCalled();
    });

    it("token expires in approximately 15 minutes", async () => {
        mockUserRepo.findByEmail.mockResolvedValue({ id: 7, name: "Ana", email: "a@b.com" });

        const before = new Date();
        const useCase = requestPasswordReset(mockUserRepo, mockAuthTokenRepo, mockEmailSender);
        await useCase.run("a@b.com");

        const call = mockAuthTokenRepo.create.mock.calls[0][0];
        const diffMin = (call.expiresAt.getTime() - before.getTime()) / 1000 / 60;

        expect(diffMin).toBeGreaterThanOrEqual(14);
        expect(diffMin).toBeLessThanOrEqual(16);
    });
});
