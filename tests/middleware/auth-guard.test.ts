import jwt from "jsonwebtoken";
import { authGuard } from "../../src/main/config/middleware/auth-guard";

const SECRET = "test-secret";

function mockRes() {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
}

beforeEach(() => {
    process.env.JWT_SECRET = SECRET;
});

describe("authGuard", () => {
    it("returns 401 when Authorization header is missing", () => {
        const req: any = { headers: {} };
        const res = mockRes();
        const next = jest.fn();

        authGuard(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith("Token não fornecido");
        expect(next).not.toHaveBeenCalled();
    });

    it("returns 401 when token is invalid", () => {
        const req: any = { headers: { authorization: "Bearer invalid.token.here" } };
        const res = mockRes();
        const next = jest.fn();

        authGuard(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith("Token inválido");
        expect(next).not.toHaveBeenCalled();
    });

    it("calls next and sets userId on valid token", () => {
        const token = jwt.sign({ userId: 5 }, SECRET, { expiresIn: "7d" });
        const req: any = { headers: { authorization: `Bearer ${token}` } };
        const res = mockRes();
        const next = jest.fn();

        authGuard(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(req.userId).toBe(5);
    });
});
