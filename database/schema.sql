-- ============================================================
-- recipes-api - Schema do Banco de Dados
-- ============================================================

CREATE DATABASE IF NOT EXISTS recipes;
USE recipes;

-- ------------------------------------------------------------
-- Unidades de medida (ex: xícara, colher, gramas)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS unit (
    id       INT          NOT NULL AUTO_INCREMENT,
    name     VARCHAR(50)  NOT NULL,
    PRIMARY KEY (id)
);

-- ------------------------------------------------------------
-- Usuários
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user (
    id         INT           NOT NULL AUTO_INCREMENT,
    name       VARCHAR(100)  NOT NULL,
    email      VARCHAR(150)  NOT NULL UNIQUE,
    created_at DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);

-- ------------------------------------------------------------
-- Ingredientes (catálogo global)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ingredient (
    id     INT          NOT NULL AUTO_INCREMENT,
    name   VARCHAR(100) NOT NULL UNIQUE,
    idUnit INT          NULL,
    amount VARCHAR(50)  NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (idUnit) REFERENCES unit(id)
);

-- ------------------------------------------------------------
-- Receitas
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS recipe (
    id          INT           NOT NULL AUTO_INCREMENT,
    idUser      INT           NOT NULL,
    name        VARCHAR(150)  NOT NULL,
    description TEXT          NULL,
    directions  TEXT          NOT NULL,
    rating      DECIMAL(3,2)  NULL,
    prepTime    INT UNSIGNED  NULL,
    yields      INT           NULL,
    created_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (idUser) REFERENCES user(id)
);

-- ------------------------------------------------------------
-- Tags de receitas (ex: vegano, rápido, sobremesa)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tag (
    id     INT         NOT NULL AUTO_INCREMENT,
    idUser INT         NOT NULL,
    name   VARCHAR(50) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (idUser) REFERENCES user(id),
    UNIQUE KEY uq_tag_user_name (idUser, name)
);

CREATE TABLE IF NOT EXISTS recipe_tag (
    idRecipe INT NOT NULL,
    idTag    INT NOT NULL,
    PRIMARY KEY (idRecipe, idTag),
    FOREIGN KEY (idRecipe) REFERENCES recipe(id) ON DELETE CASCADE,
    FOREIGN KEY (idTag)    REFERENCES tag(id)    ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- Ingredientes de uma receita (relação N:N com quantidade)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS recipe_ingredient (
    idRecipe     INT         NOT NULL,
    idIngredient INT         NOT NULL,
    amount       VARCHAR(50) NULL,
    PRIMARY KEY (idRecipe, idIngredient),
    FOREIGN KEY (idRecipe)     REFERENCES recipe(id)     ON DELETE CASCADE,
    FOREIGN KEY (idIngredient) REFERENCES ingredient(id)
);

-- ------------------------------------------------------------
-- Fotos das receitas
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS recipe_photo (
    id        INT          NOT NULL AUTO_INCREMENT,
    idRecipe  INT          NOT NULL,
    url       VARCHAR(500) NOT NULL,
    isPrimary TINYINT      NOT NULL DEFAULT 0,
    PRIMARY KEY (id),
    FOREIGN KEY (idRecipe) REFERENCES recipe(id) ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- Tokens de autenticação (magic link)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS auth_token (
    id         INT          NOT NULL AUTO_INCREMENT,
    idUser     INT          NOT NULL,
    hash       VARCHAR(255) NOT NULL UNIQUE,
    expires_at DATETIME     NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (idUser) REFERENCES user(id) ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- Favoritos (usuário x receita)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_recipe (
    idUser   INT NOT NULL,
    idRecipe INT NOT NULL,
    PRIMARY KEY (idUser, idRecipe),
    FOREIGN KEY (idUser)   REFERENCES user(id)   ON DELETE CASCADE,
    FOREIGN KEY (idRecipe) REFERENCES recipe(id) ON DELETE CASCADE
);
