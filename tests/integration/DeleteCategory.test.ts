import CreateCategory from "@/application/usecase/category/CreateCategory";
import DeleteCategory from "@/application/usecase/category/DeleteCategory";
import GetCategory from "@/application/usecase/category/GetCategory";
import CreateDebitTransaction from "@/application/usecase/debit-transactions/CreateDebitTransaction";
import DatabaseConnection, { PgPromiseAdapter } from "@/infra/database/DatabaseConnection";
import { CategoryRepositoryDatabase } from "@/infra/repository/CategoryRepository";
import { DebitTransactionDatabase } from "@/infra/repository/DebitTransactionRepository";
import { beforeAll, expect, test } from "vitest";

let databaseConnection: DatabaseConnection;
let createCategory: CreateCategory;
let getCategory: GetCategory;
let deleteCategory: DeleteCategory;
let createDebitTransaction: CreateDebitTransaction;

beforeAll(() => {
  databaseConnection = new PgPromiseAdapter();
  const categoryRepository = new CategoryRepositoryDatabase(databaseConnection);
  createCategory = new CreateCategory(categoryRepository);
  getCategory = new GetCategory(categoryRepository);
  deleteCategory = new DeleteCategory(categoryRepository);
  const debitTransactionRepository = new DebitTransactionDatabase(databaseConnection);
  createDebitTransaction = new CreateDebitTransaction(debitTransactionRepository, categoryRepository);
});

test("Deve deletar uma categoria", async () => {
  const outputCreateCategory = await createCategory.execute({ name: `Category to delete ${Date.now()}` });
  await deleteCategory.execute(outputCreateCategory.categoryId);
  await expect(() => getCategory.execute(outputCreateCategory.categoryId)).rejects.toThrowError(
    "[GetCategory] Category not found"
  );
});

test("Não deve permitir deletar uma categoria se houver transações ligadas a ela", async () => {
  const outputCreateCategory = await createCategory.execute({ name: `Category to delete ${Date.now()}` });
  await createDebitTransaction.execute({
    date: new Date(),
    description: "Description 1",
    value: 100.5,
    categoryId: outputCreateCategory.categoryId,
  });
  await expect(() => deleteCategory.execute(outputCreateCategory.categoryId)).rejects.toThrowError(
    "[DeleteCategory] Category has transactions"
  );
});
