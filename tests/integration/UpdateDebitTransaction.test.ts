import CreateCategory from "@/application/usecase/category/CreateCategory";
import CreateDebitTransaction from "@/application/usecase/debit-transactions/CreateDebitTransaction";
import GetDebitTransaction from "@/application/usecase/debit-transactions/GetDebitTransaction";
import UpdateDebitTransaction from "@/application/usecase/debit-transactions/UpdateDebitTransaction";
import DatabaseConnection, { PgPromiseAdapter } from "@/infra/database/DatabaseConnection";
import { CategoryRepositoryDatabase } from "@/infra/repository/CategoryRepository";
import { DebitTransactionDatabase } from "@/infra/repository/DebitTransactionRepository";
import { beforeAll, expect, test } from "vitest";

let databaseConnection: DatabaseConnection;
let createCategory: CreateCategory;
let createDebitTransaction: CreateDebitTransaction;
let updateDebitTransaction: UpdateDebitTransaction;
let getDebitTransaction: GetDebitTransaction;

beforeAll(() => {
  databaseConnection = new PgPromiseAdapter();
  const categoryRepository = new CategoryRepositoryDatabase(databaseConnection);
  createCategory = new CreateCategory(categoryRepository);
  const debitTransactionRepository = new DebitTransactionDatabase(databaseConnection);
  createDebitTransaction = new CreateDebitTransaction(debitTransactionRepository, categoryRepository);
  updateDebitTransaction = new UpdateDebitTransaction(debitTransactionRepository, categoryRepository);
  getDebitTransaction = new GetDebitTransaction(debitTransactionRepository);
});

test("Deve atualizar uma transação de débito", async () => {
  const category1 = await createCategory.execute({ name: `Transaction Category ${Date.now()}` });
  const category2 = await createCategory.execute({ name: `Transaction Category ${Date.now()}` });
  const inputCreateDebitTransaction = {
    date: new Date(),
    description: "Description 1",
    value: 100.5,
    categoryId: category1.categoryId,
  };
  const outputCreateDebitTransaction = await createDebitTransaction.execute(inputCreateDebitTransaction);
  const inputUpdateDebitTransaction = {
    id: outputCreateDebitTransaction.transactionId,
    description: "Description 2",
    categoryId: category2.categoryId,
  };
  await updateDebitTransaction.execute(inputUpdateDebitTransaction);
  const outputGetDebitTransaction = await getDebitTransaction.execute(outputCreateDebitTransaction.transactionId);
  expect(outputGetDebitTransaction.description).toBe(inputUpdateDebitTransaction.description);
  expect(outputGetDebitTransaction.categoryId).toBe(inputUpdateDebitTransaction.categoryId);
});

test("Não deve atualizar uma transação que não existe", async () => {
  const inputUpdateDebitTransaction = {
    id: crypto.randomUUID(),
    description: "Description 2",
    categoryId: crypto.randomUUID(),
  };
  await expect(() => updateDebitTransaction.execute(inputUpdateDebitTransaction)).rejects.toThrowError(
    "[UpdateDebitTransaction] Debit transaction not found"
  );
});

test("Não deve atualizar uma transação se a categoria não existir", async () => {
  const category1 = await createCategory.execute({ name: `Transaction Category ${Date.now()}` });
  const inputCreateDebitTransaction = {
    date: new Date(),
    description: "Description 1",
    value: 100.5,
    categoryId: category1.categoryId,
  };
  const outputCreateDebitTransaction = await createDebitTransaction.execute(inputCreateDebitTransaction);
  const inputUpdateDebitTransaction = {
    id: outputCreateDebitTransaction.transactionId,
    description: "Description 2",
    categoryId: crypto.randomUUID(),
  };
  await expect(() => updateDebitTransaction.execute(inputUpdateDebitTransaction)).rejects.toThrowError(
    "[UpdateDebitTransaction] Category not found"
  );
});
