import CreateCategory from "@/application/usecase/category/CreateCategory";
import GetCategory from "@/application/usecase/category/GetCategory";
import UpdateCategory from "@/application/usecase/category/UpdateCategory";
import DatabaseConnection, { PgPromiseAdapter } from "@/infra/database/DatabaseConnection";
import { CategoryRepositoryDatabase } from "@/infra/repository/CategoryRepository";
import { beforeAll, expect, test } from "vitest";

let databaseConnection: DatabaseConnection;
let createCategory: CreateCategory;
let updateCategory: UpdateCategory;
let getCategory: GetCategory;

beforeAll(() => {
  databaseConnection = new PgPromiseAdapter();
  const categoryRepository = new CategoryRepositoryDatabase(databaseConnection);
  createCategory = new CreateCategory(categoryRepository);
  updateCategory = new UpdateCategory(categoryRepository);
  getCategory = new GetCategory(categoryRepository);
});

test("Deve atualizar uma categoria", async () => {
  const outputCreateCategory = await createCategory.execute({ name: `Category to update ${Date.now()}` });
  const updatedName = `Category updated ${Date.now()}`;
  const inputUpdateCategory = { id: outputCreateCategory.categoryId, name: updatedName };
  await updateCategory.execute(inputUpdateCategory);
  const outputGetCategory = await getCategory.execute(outputCreateCategory.categoryId);
  expect(outputGetCategory.name).toBe(updatedName);
});

test("Não deve atualizar uma categoria que não existe", async () => {
  const inputUpdateCategory = { id: crypto.randomUUID(), name: "Category not found" };
  await expect(() => updateCategory.execute(inputUpdateCategory)).rejects.toThrowError(
    "[UpdateCategory] Category not found"
  );
});

test("Não deve atualizar uma categoria com nome que já existe", async () => {
  const updatedName = `Category updated ${Date.now()}`;
  await createCategory.execute({ name: updatedName });
  const outputCreateCategory = await createCategory.execute({ name: `Category to update ${Date.now()}` });
  const inputUpdateCategory = { id: outputCreateCategory.categoryId, name: updatedName };
  await expect(() => updateCategory.execute(inputUpdateCategory)).rejects.toThrowError(
    "[UpdateCategory] Category with name already exists"
  );
});
