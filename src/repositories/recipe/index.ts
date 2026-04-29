import { RecipeRepositoryMethods, RecipeResult, RecipeFilters } from "./interfaces/methods";
import { connection } from "../../main/config/connection-mysql";
import { Recipe } from "../../entities/recipe/interfaces/recipe";

export function recipeRepository(): RecipeRepositoryMethods {
  const database = connection();

  async function createOrUpdate(data: Recipe): Promise<number> {
    let recipeId = data.id;

    const directions = JSON.stringify(data.directions);

    if (recipeId) {
      await database.execute(
        `update recipe set name = ?, description = ?, directions = ?, rating = ?, prepTime = ?, yields = ? where id = ?`,
        [data.name, data.description ?? null, directions, data.rating ?? null, data.prepTime ?? null, data.yields ?? null, recipeId]
      );
      await database.execute(
        `delete from recipe_ingredient where idRecipe = ?`,
        [recipeId]
      );
    } else {
      const { insertId } = await database.execute<{ insertId: number }>(
        `insert into recipe (idUser, name, description, directions, rating, prepTime, yields) values (?, ?, ?, ?, ?, ?, ?)`,
        [data.idUser, data.name, data.description ?? null, directions, data.rating ?? null, data.prepTime ?? null, data.yields ?? null]
      );
      recipeId = insertId;
    }

    for (const ingredient of data.ingredients) {
      const name = ingredient.name.trim().toLowerCase();

      const existing = await database.execute<{ id: number }[]>(
        `select id from ingredient where lower(name) = ?`,
        [name]
      );

      const ingredientId = existing[0]?.id ?? (
        await database.execute<{ insertId: number }>(
          `insert into ingredient (name) values (?)`,
          [ingredient.name.trim()]
        )
      ).insertId;

      await database.execute(
        `insert into recipe_ingredient (idRecipe, idIngredient, amount) values (?, ?, ?)`,
        [recipeId, ingredientId, ingredient.amount ?? null]
      );
    }

    return recipeId;
  }

  async function syncTags(idRecipe: number, tagIds: number[]): Promise<void> {
    await database.execute(
      `DELETE FROM recipe_tag WHERE idRecipe = ?`,
      [idRecipe]
    );

    for (const idTag of tagIds) {
      await database.execute(
        `INSERT INTO recipe_tag (idRecipe, idTag) VALUES (?, ?)`,
        [idRecipe, idTag]
      );
    }
  }

  async function getTagsByRecipeId(idRecipe: number): Promise<string[]> {
    const rows = await database.execute<{ name: string }[]>(
      `SELECT t.name FROM tag t
       JOIN recipe_tag rt ON rt.idTag = t.id
       WHERE rt.idRecipe = ?
       ORDER BY t.name ASC`,
      [idRecipe]
    );
    return rows.map(r => r.name);
  }

  async function getAll(filters?: RecipeFilters): Promise<RecipeResult[]> {
    const whereConditions: string[] = [];
    const whereParams: any[] = [];
    const orderParams: any[] = [];

    if (filters?.ingredient) {
      whereConditions.push(`EXISTS (
      SELECT 1 FROM recipe_ingredient ri
      JOIN ingredient i ON i.id = ri.idIngredient
      WHERE ri.idRecipe = r.id AND lower(i.name) LIKE ?
    )`);
      whereParams.push(`%${filters.ingredient.toLowerCase()}%`);
    }

    if (filters?.name) {
      whereConditions.push(`lower(r.name) LIKE ?`);
      whereParams.push(`%${filters.name.toLowerCase()}%`);
      orderParams.push(filters.name, `${filters.name.toLowerCase()}%`);
    }

    if (filters?.tags && filters.tags.length > 0) {
      for (const tag of filters.tags) {
        whereConditions.push(`EXISTS (
        SELECT 1 FROM recipe_tag rt
        JOIN tag t ON t.id = rt.idTag
        WHERE rt.idRecipe = r.id AND lower(t.name) = lower(?)
      )`);
        whereParams.push(tag);
      }
    }

    if (filters?.prepTime !== undefined) {
      whereConditions.push(`r.prepTime = ?`);
      whereParams.push(filters.prepTime);
    }

    const where = whereConditions.length > 0
      ? `WHERE ${whereConditions.join(" AND ")}`
      : "";

    const orderBy = filters?.name
      ? `ORDER BY CASE WHEN lower(r.name) = lower(?) THEN 0 WHEN lower(r.name) LIKE lower(?) THEN 1 ELSE 2 END, r.created_at DESC`
      : `ORDER BY r.created_at DESC`;

    const allParams = [...whereParams, ...orderParams];

    const recipes = await database.execute<RecipeResult[]>(
      `SELECT r.*,
        (SELECT json_arrayagg(json_object('id', i.id, 'name', i.name, 'amount', ri.amount))
         FROM recipe_ingredient ri JOIN ingredient i ON i.id = ri.idIngredient
         WHERE ri.idRecipe = r.id) AS ingredients,
        (SELECT json_arrayagg(json_object('id', p.id, 'url', p.url, 'isPrimary', p.isPrimary))
         FROM recipe_photo p WHERE p.idRecipe = r.id) AS photos
       FROM recipe r
       ${where}
       ${orderBy}`,
      allParams
    );
    return recipes;
  }

  async function getById(id: number): Promise<RecipeResult | null> {
    const rows = await database.execute<RecipeResult[]>(
      `select r.*,
        (select json_arrayagg(json_object('id', i.id, 'name', i.name, 'amount', ri.amount))
         from recipe_ingredient ri join ingredient i on i.id = ri.idIngredient
         where ri.idRecipe = r.id) as ingredients,
        (select json_arrayagg(json_object('id', p.id, 'url', p.url, 'isPrimary', p.isPrimary))
         from recipe_photo p where p.idRecipe = r.id) as photos
       from recipe r where r.id = ?`,
      [id]
    );
    return rows[0] ?? null;
  }

  async function remove(id: number): Promise<void> {
    await database.execute(
      `delete from recipe where id = ?`,
      [id]
    );
  }

  return {
    createOrUpdate,
    getAll,
    getById,
    remove,
    syncTags,
    getTagsByRecipeId,
  };
}
