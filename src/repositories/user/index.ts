import { UserRepositoryMethods } from "./interfaces/methods";
import { User } from "../../entities/user/interfaces/user";
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

    return { findByEmail };
}
