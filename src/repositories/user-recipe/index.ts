import { connection } from "../../main/config/connection-mysql"
import { UserFavorite } from "../../entities/user-recipe/interfaces/user-recipe"
import { UserRecipeRepositoryMethods } from "./interfaces/methods"

export function userRecipeRepository(): UserRecipeRepositoryMethods {
    const database = connection()

    async function save(idUser: number, idRecipe: number): Promise<'saved' | 'already_exists'> {
        const result = await database.execute<{ affectedRows: number }>(
            `INSERT IGNORE INTO user_recipe (idUser, idRecipe) VALUES (?, ?)`,
            [idUser, idRecipe]
        )
        return result.affectedRows === 1 ? 'saved' : 'already_exists'
    }

    async function remove(idUser: number, idRecipe: number): Promise<'removed' | 'not_found'> {
        const result = await database.execute<{ affectedRows: number }>(
            `DELETE FROM user_recipe WHERE idUser = ? AND idRecipe = ?`,
            [idUser, idRecipe]
        )
        return result.affectedRows === 1 ? 'removed' : 'not_found'
    }

    async function findAll(idUser: number): Promise<UserFavorite[]> {
        type RawRow = {
            id: number
            name: string
            prepTime: number | null
            primaryPhoto: string | null
            tags: string | null
        }

        const rows = await database.execute<RawRow[]>(
            `SELECT r.id, r.name, r.prepTime,
                    rp.url AS primaryPhoto,
                    GROUP_CONCAT(t.name ORDER BY t.name SEPARATOR ',') AS tags
             FROM user_recipe ur
             JOIN recipe r ON r.id = ur.idRecipe
             LEFT JOIN recipe_photo rp ON rp.idRecipe = r.id AND rp.isPrimary = 1
             LEFT JOIN recipe_tag rt ON rt.idRecipe = r.id
             LEFT JOIN tag t ON t.id = rt.idTag
             WHERE ur.idUser = ?
             GROUP BY r.id, r.name, r.prepTime, rp.url
             ORDER BY r.name ASC`,
            [idUser]
        )

        return rows.map(row => ({
            ...row,
            tags: row.tags ? row.tags.split(',') : []
        }))
    }

    async function recipeExists(idRecipe: number): Promise<boolean> {
        const rows = await database.execute<{ id: number }[]>(
            `SELECT id FROM recipe WHERE id = ? LIMIT 1`,
            [idRecipe]
        )
        return rows.length > 0
    }

    return { save, remove, findAll, recipeExists }
}
