CREATE SCHEMA IF NOT EXISTS myfinances;

CREATE TABLE IF NOT EXISTS myfinances.categories (
  id UUID PRIMARY KEY,
  name text NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS myfinances.transactions (
  id UUID PRIMARY KEY,
  date timestamp NOT NULL,
  description text NOT NULL,
  value numeric NOT NULL
);

ALTER TABLE myfinances.transactions ADD COLUMN category_id UUID NOT NULL;
ALTER TABLE myfinances.transactions ADD FOREIGN KEY (category_id) REFERENCES myfinances.categories;