import CategoryRepository from "@/core/application/repository/CategoryRepository";
import DatabaseConnection, { PgPromiseAdapter } from "@/core/infra/database/DatabaseConnection";
import { CategoryRepositoryDatabase } from "@/core/infra/repository/CategoryRepositoryDatabase";
import crypto from "crypto";
import { afterAll, beforeAll, expect, test } from "vitest";

let databaseConnection: DatabaseConnection;
let categoryRepository: CategoryRepository;

beforeAll(() => {
  databaseConnection = new PgPromiseAdapter();
  categoryRepository = new CategoryRepositoryDatabase(databaseConnection);
});

test("Deve retornar undefined se a categoria não existir", async () => {
  const output = await categoryRepository.findById(crypto.randomUUID());
  expect(output).toBeUndefined();
});

afterAll(() => {
  databaseConnection.disconnect();
});
