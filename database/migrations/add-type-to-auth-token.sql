ALTER TABLE auth_token
  ADD COLUMN type ENUM('magic_link', 'password_reset')
  NOT NULL DEFAULT 'magic_link' AFTER hash;
