-- Adiciona idUser como NULL temporariamente (safe para tabelas com dados existentes)
ALTER TABLE tag ADD COLUMN idUser INT NULL AFTER id;

-- Adiciona a foreign key
ALTER TABLE tag ADD CONSTRAINT fk_tag_idUser FOREIGN KEY (idUser) REFERENCES user(id);

-- Remove o UNIQUE global em name (se existir) e substitui por UNIQUE composto
ALTER TABLE tag DROP INDEX name;
ALTER TABLE tag ADD UNIQUE KEY uq_tag_user_name (idUser, name);

-- IMPORTANTE: Preencher idUser dos registros existentes antes de tornar NOT NULL
-- UPDATE tag SET idUser = <id_do_admin> WHERE idUser IS NULL;

-- Após preencher os dados, tornar NOT NULL:
ALTER TABLE tag MODIFY COLUMN idUser INT NOT NULL;
