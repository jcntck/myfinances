import CreateCategory from "@/core/application/usecase/category/CreateCategory";
import CreateCreditTransaction from "@/core/application/usecase/credit-transactions/CreateCreditTransaction";
import GetCreditTransaction from "@/core/application/usecase/credit-transactions/GetCreditTransaction";
import UpdateCreditTransaction from "@/core/application/usecase/credit-transactions/UpdateCreditTransaction";
import DatabaseConnection, { PgPromiseAdapter } from "@/core/infra/database/DatabaseConnection";
import { CategoryRepositoryDatabase } from "@/core/infra/repository/CategoryRepositoryDatabase";
import { TransactionRepositoryDatabase } from "@/core/infra/repository/TransactionRepositoryDatabase";
import CategoryDummy from "@/tests/dummies/CategoryDummy";
import CreditTransactionDummy from "@/tests/dummies/CreditTransactionDummy";
import { afterAll, beforeAll, expect, test } from "vitest";

let databaseConnection: DatabaseConnection;
let createCategory: CreateCategory;
let createCreditTransaction: CreateCreditTransaction;
let updateCreditTransaction: UpdateCreditTransaction;
let getCreditTransaction: GetCreditTransaction;

beforeAll(() => {
  databaseConnection = new PgPromiseAdapter();
  const categoryRepository = new CategoryRepositoryDatabase(databaseConnection);
  createCategory = new CreateCategory(categoryRepository);
  const transactionRepository = new TransactionRepositoryDatabase(databaseConnection);
  createCreditTransaction = new CreateCreditTransaction(transactionRepository, categoryRepository);
  updateCreditTransaction = new UpdateCreditTransaction(transactionRepository, categoryRepository);
  getCreditTransaction = new GetCreditTransaction(transactionRepository);
});

test("Deve atualizar uma transação de crédito", async () => {
  const category1 = await createCategory.execute(CategoryDummy.create());
  const category2 = await createCategory.execute(CategoryDummy.create());
  const inputCreateCreditTransaction = CreditTransactionDummy.create({
    categoryId: category1.categoryId,
  });
  const outputCreateCreditTransaction = await createCreditTransaction.execute(inputCreateCreditTransaction);
  const inputUpdateCreditTransaction = CreditTransactionDummy.update({
    transactionId: outputCreateCreditTransaction.transactionId,
    categoryId: category2.categoryId,
  });
  await updateCreditTransaction.execute(inputUpdateCreditTransaction);
  const outputGetCreditTransaction = await getCreditTransaction.execute(outputCreateCreditTransaction.transactionId);
  expect(outputGetCreditTransaction.description).toBe(inputUpdateCreditTransaction.description);
  expect(outputGetCreditTransaction.categoryId).toBe(inputUpdateCreditTransaction.categoryId);
});

test("Não deve atualizar uma transação que não existe", async () => {
  const inputUpdateCreditTransaction = CreditTransactionDummy.update({
    transactionId: crypto.randomUUID(),
    categoryId: crypto.randomUUID(),
  });
  await expect(() => updateCreditTransaction.execute(inputUpdateCreditTransaction)).rejects.toThrowError(
    "[UpdateCreditTransaction] Credit transaction not found"
  );
});

test("Não deve atualizar uma transação se a categoria não existir", async () => {
  const category1 = await createCategory.execute(CategoryDummy.create());
  const inputCreateDebitTransaction = CreditTransactionDummy.create({
    categoryId: category1.categoryId,
  });
  const outputCreateDebitTransaction = await createCreditTransaction.execute(inputCreateDebitTransaction);
  const inputUpdateDebitTransaction = CreditTransactionDummy.update({
    transactionId: outputCreateDebitTransaction.transactionId,
    categoryId: crypto.randomUUID(),
  });
  await expect(() => updateCreditTransaction.execute(inputUpdateDebitTransaction)).rejects.toThrowError(
    "[UpdateCreditTransaction] Category not found"
  );
});

afterAll(async () => {
  await databaseConnection.disconnect();
});
