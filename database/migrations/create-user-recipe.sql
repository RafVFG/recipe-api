-- database/migrations/create-user-recipe.sql
CREATE TABLE IF NOT EXISTS user_recipe (
    idUser   INT NOT NULL,
    idRecipe INT NOT NULL,
    PRIMARY KEY (idUser, idRecipe),
    FOREIGN KEY (idUser)   REFERENCES user(id)   ON DELETE CASCADE,
    FOREIGN KEY (idRecipe) REFERENCES recipe(id) ON DELETE CASCADE
);
