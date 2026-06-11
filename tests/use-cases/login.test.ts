import { login } from "../../src/use-cases/login";

const mockUserRepo = {
    findByEmail: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
    updatePassword: jest.fn(),
};

beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = "test-secret";
});

describe("login", () => {
    it("throws 'Email ou senha inválidos' when user not found", async () => {
        mockUserRepo.findByEmail.mockResolvedValue(null);

        const useCase = login(mockUserRepo);
        await expect(useCase.run("a@b.com", "senha123")).rejects.toThrow("Email ou senha inválidos");
    });

    it("throws 'Email ou senha inválidos' when password is wrong", async () => {
        mockUserRepo.findByEmail.mockResolvedValue({
            id: 1, name: "Ana", email: "a@b.com",
            password: "$2b$10$invalidhashfortesting000000000000000000000000000000000000",
        });

        const useCase = login(mockUserRepo);
        await expect(useCase.run("a@b.com", "errada")).rejects.toThrow("Email ou senha inválidos");
    });

    it("returns jwt when credentials are correct", async () => {
        const bcrypt = require("bcryptjs");
        const hash = await bcrypt.hash("senha123", 10);

        mockUserRepo.findByEmail.mockResolvedValue({
            id: 42, name: "Ana", email: "a@b.com", password: hash,
        });

        const useCase = login(mockUserRepo);
        const result = await useCase.run("a@b.com", "senha123");

        expect(typeof result.jwt).toBe("string");
        expect(result.jwt.split(".").length).toBe(3);
    });

    it("does not reveal which field is wrong (same error message)", async () => {
        mockUserRepo.findByEmail.mockResolvedValue(null);
        const useCase = login(mockUserRepo);
        const errorWhenNotFound = await useCase.run("a@b.com", "qualquer").catch(e => e.message);

        const bcrypt = require("bcryptjs");
        const hash = await bcrypt.hash("certa", 10);
        mockUserRepo.findByEmail.mockResolvedValue({ id: 1, name: "Ana", email: "a@b.com", password: hash });
        const errorWhenWrongPw = await useCase.run("a@b.com", "errada").catch(e => e.message);

        expect(errorWhenNotFound).toBe(errorWhenWrongPw);
    });
});
