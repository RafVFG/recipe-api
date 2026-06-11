import { registerUser } from "../../src/use-cases/register-user";

process.env.FRONTEND_URL = "http://localhost:3000";

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

const mockEmailSender = {
    send: jest.fn(),
};

beforeEach(() => {
    jest.clearAllMocks();
    mockUserRepo.create.mockResolvedValue({ id: 5, name: "Ana", email: "ana@test.com" });
    mockAuthTokenRepo.create.mockResolvedValue(undefined);
    mockEmailSender.send.mockResolvedValue(undefined);
});

describe("registerUser", () => {
    it("throws 'Email já cadastrado' when email already exists", async () => {
        mockUserRepo.findByEmail.mockResolvedValue({ id: 1, name: "Ana", email: "ana@test.com" });

        const useCase = registerUser(mockUserRepo, mockAuthTokenRepo, mockEmailSender);
        await expect(useCase.run("Ana", "ana@test.com", "senha123")).rejects.toThrow("Email já cadastrado");
    });

    it("creates user with hashed password when email is new", async () => {
        mockUserRepo.findByEmail.mockResolvedValue(null);

        const useCase = registerUser(mockUserRepo, mockAuthTokenRepo, mockEmailSender);
        await useCase.run("Ana", "ana@test.com", "senha123");

        expect(mockUserRepo.create).toHaveBeenCalledWith(
            "Ana",
            "ana@test.com",
            expect.stringMatching(/^\$2[ab]\$/)  // bcrypt hash prefix
        );
    });

    it("sends magic link after creating user", async () => {
        mockUserRepo.findByEmail.mockResolvedValue(null);

        const useCase = registerUser(mockUserRepo, mockAuthTokenRepo, mockEmailSender);
        await useCase.run("Ana", "ana@test.com", "senha123");

        expect(mockAuthTokenRepo.create).toHaveBeenCalledWith(
            expect.objectContaining({ idUser: 5, type: 'magic_link' })
        );
        expect(mockEmailSender.send).toHaveBeenCalledWith(
            expect.objectContaining({ to: "ana@test.com" })
        );
    });

    it("does not create user when email already exists", async () => {
        mockUserRepo.findByEmail.mockResolvedValue({ id: 1, name: "Ana", email: "ana@test.com" });

        const useCase = registerUser(mockUserRepo, mockAuthTokenRepo, mockEmailSender);
        await expect(useCase.run("Ana", "ana@test.com", "senha123")).rejects.toThrow();

        expect(mockUserRepo.create).not.toHaveBeenCalled();
        expect(mockEmailSender.send).not.toHaveBeenCalled();
    });

    it("token expires in approximately 15 minutes", async () => {
        mockUserRepo.findByEmail.mockResolvedValue(null);

        const before = new Date();
        const useCase = registerUser(mockUserRepo, mockAuthTokenRepo, mockEmailSender);
        await useCase.run("Ana", "ana@test.com", "senha123");

        const call = mockAuthTokenRepo.create.mock.calls[0][0];
        const diffMin = (call.expiresAt.getTime() - before.getTime()) / 1000 / 60;

        expect(diffMin).toBeGreaterThanOrEqual(14);
        expect(diffMin).toBeLessThanOrEqual(16);
    });
});
