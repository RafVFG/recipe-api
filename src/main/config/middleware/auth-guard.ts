import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export function authGuard(req: Request, res: Response, next: NextFunction): void {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json("Token não fornecido");
        return;
    }

    const token = authHeader.split(" ")[1];

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };
        (req as any).userId = payload.userId;
        next();
    } catch {
        res.status(401).json("Token inválido");
    }
}
