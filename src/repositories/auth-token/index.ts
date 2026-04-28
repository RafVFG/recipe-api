import { AuthTokenRepositoryMethods, AuthTokenData } from "./interfaces/methods";
import { connection } from "../../main/config/connection-mysql";

export function authTokenRepository(): AuthTokenRepositoryMethods {
    const database = connection();

    async function create(data: { idUser: number; hash: string; expiresAt: Date }): Promise<void> {
        await database.execute(
            `INSERT INTO auth_token (idUser, hash, expires_at) VALUES (?, ?, ?)`,
            [data.idUser, data.hash, data.expiresAt]
        );
    }

    async function findByHash(hash: string): Promise<AuthTokenData | null> {
        const rows = await database.execute<AuthTokenData[]>(
            `SELECT id, idUser, hash, expires_at FROM auth_token WHERE hash = ? LIMIT 1`,
            [hash]
        );
        return rows[0] ?? null;
    }

    async function deleteByHash(hash: string): Promise<void> {
        await database.execute(
            `DELETE FROM auth_token WHERE hash = ?`,
            [hash]
        );
    }

    return { create, findByHash, deleteByHash };
}
