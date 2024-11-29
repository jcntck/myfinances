import CreateCategory from "@/application/usecase/category/CreateCategory";
import CreateDebitTransaction from "@/application/usecase/debit-transactions/CreateDebitTransaction";
import GetDebitTransaction from "@/application/usecase/debit-transactions/GetDebitTransaction";
import DatabaseConnection, { PgPromiseAdapter } from "@/infra/database/DatabaseConnection";
import { CategoryRepositoryDatabase } from "@/infra/repository/CategoryRepository";
import { DebitTransactionDatabase } from "@/infra/repository/DebitTransactionRepository";
import { afterAll, beforeAll, expect, test } from "vitest";
import DebitTransactionDummy from "@/tests/dummies/DebitTransactionDummy";
import CategoryDummy from "@/tests/dummies/CategoryDummy";

let databaseConnection: DatabaseConnection;
let createCategory: CreateCategory;
let createDebitTransaction: CreateDebitTransaction;
let getDebitTransaction: GetDebitTransaction;

beforeAll(() => {
  databaseConnection = new PgPromiseAdapter();
  const categoryRepository = new CategoryRepositoryDatabase(databaseConnection);
  createCategory = new CreateCategory(categoryRepository);
  const debitTransactionRepository = new DebitTransactionDatabase(databaseConnection);
  createDebitTransaction = new CreateDebitTransaction(debitTransactionRepository, categoryRepository);
  getDebitTransaction = new GetDebitTransaction(debitTransactionRepository);
});

test("Deve criar uma transação de débito", async () => {
  const { categoryId } = await createCategory.execute(CategoryDummy.create());
  const inputCreateDebitTransaction = DebitTransactionDummy.create({ categoryId });
  const outputCreateDebitTransaction = await createDebitTransaction.execute(inputCreateDebitTransaction);
  expect(outputCreateDebitTransaction.transactionId).toBeDefined();
  const outputGetDebitTransaction = await getDebitTransaction.execute(outputCreateDebitTransaction.transactionId);
  expect(outputGetDebitTransaction.id).toEqual(outputCreateDebitTransaction.transactionId);
  expect(outputGetDebitTransaction.date).toEqual(inputCreateDebitTransaction.date);
  expect(outputGetDebitTransaction.description).toEqual(inputCreateDebitTransaction.description);
  expect(outputGetDebitTransaction.value).toEqual(inputCreateDebitTransaction.value);
  expect(outputGetDebitTransaction.categoryId).toEqual(inputCreateDebitTransaction.categoryId);
});

test("Não deve criar uma transação de débito se a categoria não existir", async () => {
  await expect(() =>
    createDebitTransaction.execute(DebitTransactionDummy.create({ categoryId: crypto.randomUUID() }))
  ).rejects.toThrowError("[CreateDebitTransaction] Category not found");
});

afterAll(async () => {
  await databaseConnection.disconnect();
});
