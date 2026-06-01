import { UserRepositoryMethods } from "./interfaces/methods";
import { User, UserProfile } from "../../entities/user/interfaces/user";
import { connection } from "../../main/config/connection-mysql";

export function userRepository(): UserRepositoryMethods {
    const database = connection();

    async function findByEmail(email: string): Promise<User | null> {
        const rows = await database.execute<User[]>(
            `SELECT id, name, email FROM user WHERE email = ? LIMIT 1`,
            [email]
        );
        return rows[0] ?? null;
    }

    async function create(name: string, email: string): Promise<User> {
        const result = await database.execute<{ insertId: number }>(
            `INSERT INTO user (name, email) VALUES (?, ?)`,
            [name, email]
        );
        if (!result.insertId) {
            throw new Error("Falha ao criar usuário: insertId inválido");
        }
        return { id: result.insertId, name, email };
    }

    async function findById(id: number): Promise<UserProfile | null> {
        const rows = await database.execute<UserProfile[]>(
            `SELECT
                u.id,
                u.name,
                u.email,
                COUNT(DISTINCT r.id)        AS recipesCount,
                COUNT(DISTINCT ur.idRecipe) AS favoritesCount
            FROM user u
            LEFT JOIN recipe      r  ON r.idUser  = u.id
            LEFT JOIN user_recipe ur ON ur.idUser  = u.id
            WHERE u.id = ?
            GROUP BY u.id
            LIMIT 1`,
            [id]
        );
        return rows[0] ?? null;
    }

    return { findByEmail, create, findById };
}
