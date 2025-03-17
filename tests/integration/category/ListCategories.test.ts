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
  expect(output.currentPage).toBe(1);
  expect(output.totalItems).toBeDefined();
  expect(output.totalItems).toBeGreaterThan(0);
  expect(output.totalPages).toBeDefined();
  expect(output.totalPages).toBeGreaterThan(0);
});

test("Deve listar categorias com filtro de nome", async () => {
  const category = CategoryDummy.create();
  await createCategory.execute(category);
  const { items } = await listCategories.execute({ page: 1, size: 10, name: category.name });
  expect(items).toBeDefined();
  expect(items[0].name).toBeDefined();
  expect(items[0].name).toBe(category.name);
});

test("Deve retornar uma lista vazia de categorias", async () => {
  const output = await listCategories.execute({ page: 1, size: 10, name: "Não existe" });

  console.log(output);
  expect(output.items).toBeDefined();
  expect(output.currentPage).toBe(1);
  expect(output.totalItems).toBe(0);
  expect(output.totalPages).toBe(1);
});

afterAll(async () => {
  await databaseConnection.disconnect();
});
