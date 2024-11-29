import Home from "@/app/page";
import Application from "@/Application";
import CategoryRepository from "@/domain/repository/CategoryRepository";
import DatabaseConnection, { PgPromiseAdapter } from "@/infra/database/DatabaseConnection";
import { CategoryRepositoryDatabase } from "@/infra/repository/CategoryRepository";
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
  const Component = await resolvedComponent(Home, screen);
  render(<Component />);
  const categoryIdElement = document.querySelector("#category_id");
  const nameElement = document.querySelector("#category_name");
  expect(screen.getByRole("heading", { level: 1, name: "Home" })).toBeDefined();
  expect(categoryIdElement).toBeDefined();
  expect(nameElement).toBeDefined();
});

afterAll(async () => {
  await databaseConnection.disconnect();
});
