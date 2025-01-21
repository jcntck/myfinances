CREATE SCHEMA IF NOT EXISTS myfinances;

create extension unaccent schema myfinances;

CREATE TABLE
  IF NOT EXISTS myfinances.categories (id UUID PRIMARY KEY, name text NOT NULL UNIQUE);

CREATE TYPE myfinances.transactions_status AS ENUM ('pending', 'paid');

CREATE TYPE myfinances.transactions_type as ENUM ('debit', 'credit');

CREATE TABLE
  IF NOT EXISTS myfinances.transactions (
    id UUID PRIMARY KEY,
    date timestamp NOT NULL,
    description text NOT NULL,
    value numeric NOT NULL,
    status myfinances.transactions_status NOT NULL,
    type myfinances.transactions_type NOT NULL,
    is_recurring boolean default false
  );

ALTER TABLE myfinances.transactions
ADD COLUMN category_id UUID NOT NULL;

ALTER TABLE myfinances.transactions ADD FOREIGN KEY (category_id) REFERENCES myfinances.categories ON DELETE CASCADE;

CREATE TABLE
  IF NOT EXISTS myfinances.installments (
    id UUID PRIMARY KEY,
    due_date timestamp NOT NULL,
    value numeric NOT NULL,
    installment_number integer NOT NULL,
    transaction_id UUID NOT NULL
  );

ALTER TABLE myfinances.installments ADD FOREIGN KEY (transaction_id) REFERENCES myfinances.transactions ON DELETE CASCADE;