import Home from '@/app/page';
import Application from '@/Application';
import CreateCategory from '@/application/usecase/category/CreateCategory';
import CategoryRepository from '@/domain/repository/CategoryRepository';
import DatabaseConnection, {
  PgPromiseAdapter,
} from '@/infra/database/DatabaseConnection';
import { CategoryRepositoryDatabase } from '@/infra/repository/CategoryRepository';
import CategoryDummy from '@/tests/dummies/CategoryDummy';
import { resolveServerSideComponent } from '@/tests/helpers/resolved-component';
import { render, screen } from '@testing-library/react';
import { afterAll, beforeAll, expect, test } from 'vitest';

let databaseConnection: DatabaseConnection = new PgPromiseAdapter();
let categoryRepository: CategoryRepository = new CategoryRepositoryDatabase(
  databaseConnection
);

beforeAll(() => {
  const application = Application.Instance;
  application.register(databaseConnection, categoryRepository);
});

test('Deve renderizar a pagina inicial', async () => {
  const createCategory = new CreateCategory(categoryRepository);
  const createdCategory = CategoryDummy.create();
  const createCategoryOutput = await createCategory.execute(createdCategory);
  const Component = await resolveServerSideComponent(Home, {
    categoryId: createCategoryOutput.categoryId,
  });
  render(<Component />);
  const categoryIdElement = document.querySelector('#category_id')?.innerHTML;
  const nameElement = document.querySelector('#category_name')?.innerHTML;
  expect(screen.getByRole('heading', { level: 1, name: 'Home' })).toBeDefined();
  expect(categoryIdElement).toEqual(createCategoryOutput.categoryId);
  expect(nameElement).toEqual(createdCategory.name);
});

afterAll(async () => {
  await databaseConnection.disconnect();
});

