import { connection } from "../../main/config/connection-mysql";
import { RecipePhotoRepositoryMethods, RecipePhoto } from "./interfaces/methods";

export function recipePhotoRepository(): RecipePhotoRepositoryMethods {
    const database = connection();

    async function add(idRecipe: number, url: string, isPrimary: boolean): Promise<void> {
        if (isPrimary) {
            await database.execute(
                `update recipe_photo set isPrimary = 0 where idRecipe = ?`,
                [idRecipe]
            );
        }

        await database.execute(
            `insert into recipe_photo (idRecipe, url, isPrimary) values (?, ?, ?)`,
            [idRecipe, url, isPrimary ? 1 : 0]
        );
    }

    async function remove(id: number): Promise<void> {
        await database.execute(
            `delete from recipe_photo where id = ?`,
            [id]
        );
    }

    async function findById(id: number): Promise<RecipePhoto | null> {
        const rows = await database.execute<RecipePhoto[]>(
            `select id, idRecipe, url, isPrimary from recipe_photo where id = ?`,
            [id]
        )
        return rows[0] ?? null
    }

    async function promotePrimary(idRecipe: number): Promise<void> {
        await database.execute(
            `update recipe_photo set isPrimary = 1 where idRecipe = ? order by id asc limit 1`,
            [idRecipe]
        )
    }

    return {
        add,
        remove,
        findById,
        promotePrimary
    }
}
