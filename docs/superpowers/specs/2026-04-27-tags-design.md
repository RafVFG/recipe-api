# Design: Sistema de Tags

**Data:** 2026-04-27
**Projeto:** recipes-api
**Status:** Aprovado

---

## Contexto

Tags são rótulos globais (ex: "vegano", "rápido", "sobremesa") associados a receitas. A tabela `tag` e a tabela de associação `recipe_tag` já existem no schema. Este design especifica os endpoints, camadas e regras de negócio para expor essa funcionalidade.

---

## Regras de Negócio

- Qualquer usuário autenticado pode criar tags novas no catálogo global
- Tags são criadas implicitamente ao criar/atualizar uma receita — não há `POST /tag` explícito
- Somente o usuário que criou uma tag pode deletá-la
- Tags são passadas por nome (`string[]`) no body da receita — o backend resolve nome → ID, criando se não existir (`findOrCreate`)
- A associação receita↔tag é sincronizada a cada update (DELETE + INSERT)
- Tags retornam junto com a receita nos endpoints `GET /recipes` e `GET /recipe/:id`

---

## Migração de Schema

```sql
ALTER TABLE tag ADD COLUMN idUser INT NOT NULL AFTER id;
ALTER TABLE tag ADD FOREIGN KEY (idUser) REFERENCES user(id);
```

---

## Entidade

**`src/entities/tag/interfaces/tag.ts`**
```ts
export interface Tag {
    id?: number
    idUser: number
    name: string
}
```

---

## Repositório de Tag

**`src/repositories/tag/interfaces/methods.ts`**
```ts
export interface TagRepositoryMethods {
    findOrCreate(name: string, idUser: number): Promise<number> // retorna id
    getAll(): Promise<Tag[]>
    deleteById(id: number, idUser: number): Promise<boolean> // false = não encontrou ou não é dono
}
```

**`src/repositories/tag/index.ts`**
- `findOrCreate` — SELECT por nome; se não existe, INSERT e retorna o novo ID
- `getAll` — SELECT id, name, idUser FROM tag
- `deleteById` — DELETE WHERE id = ? AND idUser = ?; retorna `true` se `affectedRows > 0`

---

## Repositório de Receita (adições)

**`src/repositories/recipe/interfaces/methods.ts`** — novos métodos:
```ts
syncTags(idRecipe: number, tagIds: number[]): Promise<void>
getTagsByRecipeId(idRecipe: number): Promise<string[]>
```

- `syncTags` — DELETE FROM recipe_tag WHERE idRecipe = ? + INSERT dos novos (se tagIds não vazio)
- `getTagsByRecipeId` — SELECT t.name FROM tag t JOIN recipe_tag rt ON rt.idTag = t.id WHERE rt.idRecipe = ?

---

## Use Cases

### `getTags`
**`src/use-cases/get-tags/index.ts`**
- Chama `tagRepository.getAll()`
- Retorna `Tag[]`

### `delTag`
**`src/use-cases/del-tag/index.ts`**
- Chama `tagRepository.deleteById(id, idUser)`
- Se retornar `false`: lança `Error("Tag não encontrada ou sem permissão")`

### `createOrUpdateRecipe` (modificação)
- Recebe `tags?: string[]` e `idUser: number` no input
- Para cada tag: chama `tagRepository.findOrCreate(name, idUser)` → coleta IDs
- Após salvar a receita: chama `recipeRepository.syncTags(idRecipe, tagIds)`
- Se `tags` for undefined ou vazio: chama `syncTags` com array vazio (remove todas as associações)

### `getRecipeById` e `getRecipes` (modificação)
- Após buscar a receita, chama `recipeRepository.getTagsByRecipeId(id)`
- Inclui `tags: string[]` no objeto retornado

---

## Controllers e Rotas

### Novos

**`src/adapters/controllers/tag/list.ts`** — `tagListController`
- Chama `getTags.run()`
- Retorna `200` com array de tags

**`src/adapters/controllers/tag/del.ts`** — `tagDelController`
- Extrai `id` de `params`, `userId` de `httpRequest.userId`
- Chama `delTag.run(id, userId)`
- Retorna `200` em sucesso, `404` se tag não encontrada ou não é dono

**`src/main/routes/tags.ts`**
```
GET    /tags          — público       — tagListController
DELETE /tag/:id       — authGuard     — tagDelController
```

### Modificados

**`src/adapters/controllers/recipe/index.ts`** (create/update)
- Extrai `tags?: string[]` do body
- Passa `tags` e `userId` para o use case

**Response de receita** — inclui campo `tags: string[]`:
```json
{
  "id": 1,
  "name": "Bolo de Cenoura",
  "tags": ["vegano", "sobremesa"],
  "ingredients": [...],
  ...
}
```

---

## Factories

- `src/adapters/factories/get-tags.ts`
- `src/adapters/factories/del-tag.ts`
- `src/adapters/factories/create-recipe.ts` — atualizar para injetar `tagRepository`
- `src/adapters/factories/get-recipe-by-id.ts` — atualizar para injetar dependência de tags
- `src/adapters/factories/get-recipes.ts` — atualizar para injetar dependência de tags

---

## Testes

**`tests/use-cases/get-tags.test.ts`**
- Retorna lista de tags do repositório

**`tests/use-cases/del-tag.test.ts`**
- Deleta com sucesso quando `idUser` bate (`deleteById` retorna `true`)
- Lança erro quando tag não pertence ao usuário (`deleteById` retorna `false`)

**`tests/use-cases/create-or-update-recipe.test.ts`** (extensão)
- Chama `findOrCreate` para cada tag recebida
- Chama `syncTags` com os IDs resolvidos
- Funciona sem tags (campo opcional — `syncTags` com array vazio)

---

## Arquivos a Criar

```
src/entities/tag/interfaces/tag.ts
src/entities/tag/index.ts
src/repositories/tag/interfaces/methods.ts
src/repositories/tag/index.ts
src/use-cases/get-tags/interfaces/methods.ts
src/use-cases/get-tags/index.ts
src/use-cases/del-tag/interfaces/methods.ts
src/use-cases/del-tag/index.ts
src/adapters/controllers/tag/interfaces/http.ts
src/adapters/controllers/tag/list.ts
src/adapters/controllers/tag/del.ts
src/adapters/factories/get-tags.ts
src/adapters/factories/del-tag.ts
src/main/routes/tags.ts
tests/use-cases/get-tags.test.ts
tests/use-cases/del-tag.test.ts
database/migrations/add-idUser-to-tag.sql
```

## Arquivos a Modificar

```
src/main/config/adapt-route.ts                (+ repassar userId do authGuard)
database/schema.sql
src/repositories/recipe/interfaces/methods.ts
src/repositories/recipe/index.ts
src/use-cases/create-recipe/index.ts          (+ interfaces/methods.ts)
src/use-cases/get-recipe-by-id/index.ts
src/use-cases/get-recipes/index.ts
src/adapters/controllers/recipe/index.ts
src/adapters/factories/create-recipe.ts
src/adapters/factories/get-recipe-by-id.ts
src/adapters/factories/get-recipes.ts
tests/use-cases/create-or-update-recipe.test.ts  (novo arquivo de teste)
```
