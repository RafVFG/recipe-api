import { RecipeRepositoryMethods, RecipeResult } from "./interfaces/methods";
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

  async function getAll(filters?: { ingredient?: string }): Promise<RecipeResult[]> {
    const params: any[] = [];
    let where = "";

    if (filters?.ingredient) {
      where = `where exists (
        select 1 from recipe_ingredient ri
        join ingredient i on i.id = ri.idIngredient
        where ri.idRecipe = r.id and lower(i.name) like ?
      )`;
      params.push(`%${filters.ingredient.toLowerCase()}%`);
    }

    const recipes = await database.execute<RecipeResult[]>(
      `select r.*,
        (select json_arrayagg(json_object('id', i.id, 'name', i.name, 'amount', ri.amount))
         from recipe_ingredient ri join ingredient i on i.id = ri.idIngredient
         where ri.idRecipe = r.id) as ingredients,
        (select json_arrayagg(json_object('id', p.id, 'url', p.url, 'isPrimary', p.isPrimary))
         from recipe_photo p where p.idRecipe = r.id) as photos
       from recipe r
       ${where}
       order by r.created_at desc`,
      params
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
