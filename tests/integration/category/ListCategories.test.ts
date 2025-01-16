import CreateCategory from "@/core/application/usecase/category/CreateCategory";
import ListCategories from "@/core/application/usecase/category/ListCategories";
import CategoryDAODatabase from "@/core/infra/dao/CategoryDaoDatabase";
import DatabaseConnection, { PgPromiseAdapter } from "@/core/infra/database/DatabaseConnection";
import { CategoryRepositoryDatabase } from "@/core/infra/repository/CategoryRepositoryDatabase";
import CategoryDummy from "@/tests/dummies/CategoryDummy";
import { afterAll, beforeAll, expect, test } from "vitest";

let databaseConnection: DatabaseConnection;
let listCategories: ListCategories;
let createCategory: CreateCategory;

beforeAll(() => {
  databaseConnection = new PgPromiseAdapter();
  const categoryRepository = new CategoryRepositoryDatabase(databaseConnection);
  const categoryDAO = new CategoryDAODatabase(databaseConnection);
  listCategories = new ListCategories(categoryDAO);
  createCategory = new CreateCategory(categoryRepository);
});

test("Deve listar categorias", async () => {
  const output = await listCategories.execute({ page: 1, size: 10 });
  expect(output).toBeDefined();
  expect(output.items).toBeDefined();
  expect(Array.isArray(output.items)).toBeTruthy();
  expect(output.currentPage).toBeDefined();
  expect(output.totalItems).toBeDefined();
  expect(output.totalPages).toBeDefined();
});

test("Deve listar categorias com filtro de nome", async () => {
  const category = CategoryDummy.create();
  createCategory.execute(category);
  const { items } = await listCategories.execute({ page: 1, size: 10, name: category.name });
  expect(items).toBeDefined();
  expect(items[0].name).toBeDefined();
  expect(items[0].name).toBe(category.name);
});

afterAll(async () => {
  await databaseConnection.disconnect();
});
