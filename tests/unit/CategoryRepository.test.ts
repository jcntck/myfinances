import CategoryRepository from "@/domain/repository/CategoryRepository";
import DatabaseConnection, { PgPromiseAdapter } from "@/infra/database/DatabaseConnection";
import { CategoryRepositoryDatabase } from "@/infra/repository/CategoryRepository";
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
