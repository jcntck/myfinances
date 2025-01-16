import CreateCategory from "@/core/application/usecase/category/CreateCategory";
import DeleteCategory from "@/core/application/usecase/category/DeleteCategory";
import GetCategory from "@/core/application/usecase/category/GetCategory";
import CreateDebitTransaction from "@/core/application/usecase/debit-transactions/CreateDebitTransaction";
import DatabaseConnection, { PgPromiseAdapter } from "@/core/infra/database/DatabaseConnection";
import { CategoryRepositoryDatabase } from "@/core/infra/repository/CategoryRepositoryDatabase";
import { TransactionRepositoryDatabase } from "@/core/infra/repository/TransactionRepositoryDatabase";
import { beforeAll, expect, test } from "vitest";
import CategoryDummy from "@/tests/dummies/CategoryDummy";
import DebitTransactionDummy from "@/tests/dummies/DebitTransactionDummy";

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
  const debitTransactionRepository = new TransactionRepositoryDatabase(databaseConnection);
  createDebitTransaction = new CreateDebitTransaction(debitTransactionRepository, categoryRepository);
});

test("Deve deletar uma categoria", async () => {
  const outputCreateCategory = await createCategory.execute(CategoryDummy.create());
  await deleteCategory.execute(outputCreateCategory.categoryId);
  await expect(() => getCategory.execute(outputCreateCategory.categoryId)).rejects.toThrowError(
    "[GetCategory] Category not found"
  );
});

test("Não deve permitir deletar uma categoria se houver transações ligadas a ela", async () => {
  const outputCreateCategory = await createCategory.execute(CategoryDummy.create());
  await createDebitTransaction.execute(DebitTransactionDummy.create({ categoryId: outputCreateCategory.categoryId }));
  await expect(() => deleteCategory.execute(outputCreateCategory.categoryId)).rejects.toThrowError(
    "[DeleteCategory] Category has transactions"
  );
});
