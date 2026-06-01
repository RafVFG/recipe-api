import { registerUser } from "../../src/use-cases/register-user";

process.env.FRONTEND_URL = "http://localhost:3000";

const mockUserRepo = {
    findByEmail: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
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

describe("registerUser", () => {
    it("throws 'Email já cadastrado' when email already exists", async () => {
        mockUserRepo.findByEmail.mockResolvedValue({ id: 1, name: "Ana", email: "ana@test.com" });

        const useCase = registerUser(mockUserRepo, mockAuthTokenRepo, mockEmailSender);

        await expect(useCase.run("Ana", "ana@test.com")).rejects.toThrow("Email já cadastrado");
    });

    it("creates user and sends email when email is new", async () => {
        mockUserRepo.findByEmail.mockResolvedValue(null);
        mockUserRepo.create.mockResolvedValue({ id: 5, name: "Ana", email: "ana@test.com" });
        mockAuthTokenRepo.create.mockResolvedValue(undefined);
        mockEmailSender.send.mockResolvedValue(undefined);

        const useCase = registerUser(mockUserRepo, mockAuthTokenRepo, mockEmailSender);
        await useCase.run("Ana", "ana@test.com");

        expect(mockUserRepo.create).toHaveBeenCalledWith("Ana", "ana@test.com");
        expect(mockAuthTokenRepo.create).toHaveBeenCalledWith(
            expect.objectContaining({ idUser: 5 })
        );
        expect(mockEmailSender.send).toHaveBeenCalledWith(
            expect.objectContaining({ to: "ana@test.com" })
        );
    });

    it("does not create user or send email when email already exists", async () => {
        mockUserRepo.findByEmail.mockResolvedValue({ id: 1, name: "Ana", email: "ana@test.com" });

        const useCase = registerUser(mockUserRepo, mockAuthTokenRepo, mockEmailSender);

        await expect(useCase.run("Ana", "ana@test.com")).rejects.toThrow();
        expect(mockUserRepo.create).not.toHaveBeenCalled();
        expect(mockEmailSender.send).not.toHaveBeenCalled();
    });

    it("token expires in approximately 15 minutes", async () => {
        mockUserRepo.findByEmail.mockResolvedValue(null);
        mockUserRepo.create.mockResolvedValue({ id: 5, name: "Ana", email: "ana@test.com" });
        mockAuthTokenRepo.create.mockResolvedValue(undefined);
        mockEmailSender.send.mockResolvedValue(undefined);

        const before = new Date();
        const useCase = registerUser(mockUserRepo, mockAuthTokenRepo, mockEmailSender);
        await useCase.run("Ana", "ana@test.com");

        const call = mockAuthTokenRepo.create.mock.calls[0][0];
        const diffMs = call.expiresAt.getTime() - before.getTime();
        const diffMin = diffMs / 1000 / 60;

        expect(diffMin).toBeGreaterThanOrEqual(14);
        expect(diffMin).toBeLessThanOrEqual(16);
    });
});
