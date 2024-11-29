import Home from "@/app/page";
import Application from "@/Application";
import CreateCategory from "@/application/usecase/category/CreateCategory";
import CategoryRepository from "@/domain/repository/CategoryRepository";
import DatabaseConnection, { PgPromiseAdapter } from "@/infra/database/DatabaseConnection";
import { CategoryRepositoryDatabase } from "@/infra/repository/CategoryRepository";
import CategoryDummy from "@/tests/dummies/CategoryDummy";
import { render, screen } from "@testing-library/react";
import { afterAll, beforeAll, expect, test, vi } from "vitest";

let databaseConnection: DatabaseConnection = new PgPromiseAdapter();
let categoryRepository: CategoryRepository = new CategoryRepositoryDatabase(databaseConnection);

beforeAll(() => {
  const application = Application.Instance;
  application.register(databaseConnection, categoryRepository);
});

async function resolvedComponent(Component: Function, props: any) {
  const ComponentResolved = await Component(props);
  return () => ComponentResolved;
}

test.only("Deve renderizar a pagina inicial", async () => {
  const createCategory = new CreateCategory(categoryRepository);
  const createdCategory = CategoryDummy.create();
  const createCategoryOutput = await createCategory.execute(createdCategory);
  const Component = await resolvedComponent(Home, { categoryId: createCategoryOutput.categoryId });
  render(<Component />);
  const categoryIdElement = document.querySelector("#category_id")?.innerHTML;
  const nameElement = document.querySelector("#category_name")?.innerHTML;
  expect(screen.getByRole("heading", { level: 1, name: "Home" })).toBeDefined();
  expect(categoryIdElement).toEqual(createCategoryOutput.categoryId);
  expect(nameElement).toEqual(createdCategory.name);
});

afterAll(async () => {
  await databaseConnection.disconnect();
});
