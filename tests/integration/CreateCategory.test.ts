import { beforeAll, expect, test } from "vitest";
import CreateCategory from "@/application/usecase/category/CreateCategory";
import GetCategory from "@/application/usecase/category/GetCategory";
import CategoryRepositoryFake from "@/infra/repository/CategoryRepository";
import CategoryRepository from "@/domain/repository/CategoryRepository";

let categoryRepository: CategoryRepository;
let createCategory: CreateCategory;
let getCategory: GetCategory;

beforeAll(() => {
  categoryRepository = new CategoryRepositoryFake();
  createCategory = new CreateCategory(categoryRepository);
  getCategory = new GetCategory(categoryRepository);
});

test("Deve criar uma categoria", async () => {
  const inputCreateCategory = { name: "Category 1" };
  const outputCreateCategory = await createCategory.execute(inputCreateCategory);
  expect(outputCreateCategory.categoryId).toBeDefined();
  const outputGetCategory = await getCategory.execute(outputCreateCategory.categoryId);
  expect(outputGetCategory.id).toBe(outputCreateCategory.categoryId);
  expect(outputGetCategory.name).toBe(inputCreateCategory.name);
});

test("Não deve criar uma categoria com o mesmo nome", async () => {
  const inputCreateCategory = { name: "Educação" };
  await createCategory.execute(inputCreateCategory);
  await expect(() => createCategory.execute(inputCreateCategory)).rejects.toThrowError(
    "[CreateCategory] Category already exists"
  );
});
