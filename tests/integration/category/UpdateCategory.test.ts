import CreateCategory from "@/application/usecase/category/CreateCategory";
import GetCategory from "@/application/usecase/category/GetCategory";
import UpdateCategory from "@/application/usecase/category/UpdateCategory";
import DatabaseConnection, { PgPromiseAdapter } from "@/infra/database/DatabaseConnection";
import { CategoryRepositoryDatabase } from "@/infra/repository/CategoryRepository";
import { beforeAll, expect, test } from "vitest";
import CategoryDummy from "@/tests/dummies/CategoryDummy";

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
  const outputCreateCategory = await createCategory.execute(CategoryDummy.create());
  const inputUpdateCategory = CategoryDummy.update({ categoryId: outputCreateCategory.categoryId });
  await updateCategory.execute(inputUpdateCategory);
  const outputGetCategory = await getCategory.execute(outputCreateCategory.categoryId);
  expect(outputGetCategory.name).toBe(inputUpdateCategory.name);
});

test("Não deve atualizar uma categoria que não existe", async () => {
  const inputUpdateCategory = CategoryDummy.update({ categoryId: crypto.randomUUID() });
  await expect(() => updateCategory.execute(inputUpdateCategory)).rejects.toThrowError(
    "[UpdateCategory] Category not found"
  );
});

test("Não deve atualizar uma categoria com nome que já existe", async () => {
  const categoryCreated = CategoryDummy.create();
  await createCategory.execute(categoryCreated);
  const outputCreateCategory = await createCategory.execute(CategoryDummy.create());
  const inputUpdateCategory = CategoryDummy.update({
    categoryId: outputCreateCategory.categoryId,
    name: categoryCreated.name,
  });
  await expect(() => updateCategory.execute(inputUpdateCategory)).rejects.toThrowError(
    "[UpdateCategory] Category with name already exists"
  );
});
