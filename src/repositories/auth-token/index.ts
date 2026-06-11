import { AuthTokenRepositoryMethods, AuthTokenData } from "./interfaces/methods";
import { connection } from "../../main/config/connection-mysql";

export function authTokenRepository(): AuthTokenRepositoryMethods {
    const database = connection();

    async function create(data: { idUser: number; hash: string; expiresAt: Date; type: 'magic_link' | 'password_reset' }): Promise<void> {
        await database.execute(
            `INSERT INTO auth_token (idUser, hash, type, expires_at) VALUES (?, ?, ?, ?)`,
            [data.idUser, data.hash, data.type, data.expiresAt]
        );
    }

    async function findByHash(hash: string, type: 'magic_link' | 'password_reset'): Promise<AuthTokenData | null> {
        const rows = await database.execute<AuthTokenData[]>(
            `SELECT id, idUser, hash, type, expires_at FROM auth_token WHERE hash = ? AND type = ? LIMIT 1`,
            [hash, type]
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
