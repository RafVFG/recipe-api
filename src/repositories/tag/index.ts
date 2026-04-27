import { TagRepositoryMethods } from "./interfaces/methods";
import { Tag } from "../../entities/tag/interfaces/tag";
import { connection } from "../../main/config/connection-mysql";

export function tagRepository(): TagRepositoryMethods {
    const database = connection();

    async function findOrCreate(name: string, idUser: number): Promise<number> {
        const normalized = name.trim().toLowerCase();

        const existing = await database.execute<{ id: number }[]>(
            `SELECT id FROM tag WHERE name = ? AND idUser = ?`,
            [normalized, idUser]
        );

        if (existing[0]) return existing[0].id;

        const result = await database.execute<{ insertId: number }>(
            `INSERT INTO tag (idUser, name) VALUES (?, ?)`,
            [idUser, normalized]
        );

        return result.insertId;
    }

    async function getAll(): Promise<Tag[]> {
        return database.execute<Tag[]>(
            `SELECT id, idUser, name FROM tag ORDER BY name ASC`
        );
    }

    async function deleteById(id: number, idUser: number): Promise<boolean> {
        const result = await database.execute<{ affectedRows: number }>(
            `DELETE FROM tag WHERE id = ? AND idUser = ?`,
            [id, idUser]
        );
        return result.affectedRows > 0;
    }

    return { findOrCreate, getAll, deleteById };
}
