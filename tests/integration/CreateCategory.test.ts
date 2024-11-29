import CreateCategory from "@/application/usecase/category/CreateCategory";
import GetCategory from "@/application/usecase/category/GetCategory";
import DatabaseConnection, { PgPromiseAdapter } from "@/infra/database/DatabaseConnection";
import { CategoryRepositoryDatabase } from "@/infra/repository/CategoryRepository";
import { afterAll, beforeAll, expect, test } from "vitest";

let databaseConnection: DatabaseConnection;
let createCategory: CreateCategory;
let getCategory: GetCategory;

beforeAll(() => {
  databaseConnection = new PgPromiseAdapter();
  const categoryRepository = new CategoryRepositoryDatabase(databaseConnection);
  createCategory = new CreateCategory(categoryRepository);
  getCategory = new GetCategory(categoryRepository);
});

test("Deve criar uma categoria", async () => {
  const inputCreateCategory = { name: `Category ${Date.now()}` };
  const outputCreateCategory = await createCategory.execute(inputCreateCategory);
  expect(outputCreateCategory.categoryId).toBeDefined();
  const outputGetCategory = await getCategory.execute(outputCreateCategory.categoryId);
  expect(outputGetCategory.id).toBe(outputCreateCategory.categoryId);
  expect(outputGetCategory.name).toBe(inputCreateCategory.name);
});

test("Não deve criar uma categoria com o mesmo nome", async () => {
  const inputCreateCategory = { name: `Category ${Date.now()}` };
  await createCategory.execute(inputCreateCategory);
  await expect(() => createCategory.execute(inputCreateCategory)).rejects.toThrowError(
    "[CreateCategory] Category already exists"
  );
});

afterAll(async () => {
  await databaseConnection.disconnect();
});
