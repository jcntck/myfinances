import CreateCategory from "@/core/application/usecase/category/CreateCategory";
import CreateCreditTransaction from "@/core/application/usecase/credit-transactions/CreateCreditTransaction";
import GetCreditTransaction from "@/core/application/usecase/credit-transactions/GetCreditTransaction";
import DatabaseConnection, { PgPromiseAdapter } from "@/core/infra/database/DatabaseConnection";
import { CategoryRepositoryDatabase } from "@/core/infra/repository/CategoryRepositoryDatabase";
import { CreditTransactionRepositoryDatabase } from "@/core/infra/repository/CreditTransactionRepositoryDatabase";
import CategoryDummy from "@/tests/dummies/CategoryDummy";
import CreditTransactionDummy from "@/tests/dummies/CreditTransactionDummy";
import { afterAll, beforeAll, expect, test } from "vitest";

let databaseConnection: DatabaseConnection;
let createCategory: CreateCategory;
let createCreditTransaction: CreateCreditTransaction;
let getCreditTransaction: GetCreditTransaction;

beforeAll(() => {
  databaseConnection = new PgPromiseAdapter();
  const categoryRepository = new CategoryRepositoryDatabase(databaseConnection);
  createCategory = new CreateCategory(categoryRepository);
  const transactionRepository = new CreditTransactionRepositoryDatabase(databaseConnection);
  createCreditTransaction = new CreateCreditTransaction(transactionRepository, categoryRepository);
  getCreditTransaction = new GetCreditTransaction(transactionRepository);
});

test("Deve criar uma transação de crédito", async () => {
  const { categoryId } = await createCategory.execute(CategoryDummy.create());
  const inputCreateCreditTransaction = CreditTransactionDummy.create({ categoryId });
  const outputCreateCreditTransaction = await createCreditTransaction.execute(inputCreateCreditTransaction);
  expect(outputCreateCreditTransaction.transactionId).toBeDefined();

  const outputGetDebitTransaction = await getCreditTransaction.execute(outputCreateCreditTransaction.transactionId);
  expect(outputGetDebitTransaction.id).toEqual(outputCreateCreditTransaction.transactionId);
  expect(outputGetDebitTransaction.date).toEqual(inputCreateCreditTransaction.date);
  expect(outputGetDebitTransaction.description).toEqual(inputCreateCreditTransaction.description);
  expect(outputGetDebitTransaction.value).toEqual(inputCreateCreditTransaction.value);
  expect(outputGetDebitTransaction.categoryId).toEqual(inputCreateCreditTransaction.categoryId);
  expect(outputGetDebitTransaction.status).toEqual("pending");
  expect(outputGetDebitTransaction.type).toEqual("credit");
});

test("Deve criar uma transação de crédito parcelada", async () => {
  const { categoryId } = await createCategory.execute(CategoryDummy.create());
  const inputCreateCreditTransaction = CreditTransactionDummy.create({ categoryId, installments: 10 });
  const outputCreateCreditTransaction = await createCreditTransaction.execute(inputCreateCreditTransaction);
  expect(outputCreateCreditTransaction.transactionId).toBeDefined();
  const outputGetDebitTransaction = await getCreditTransaction.execute(outputCreateCreditTransaction.transactionId);
  expect(outputGetDebitTransaction.id).toEqual(outputCreateCreditTransaction.transactionId);
  expect(outputGetDebitTransaction.date).toEqual(inputCreateCreditTransaction.date);
  expect(outputGetDebitTransaction.description).toEqual(inputCreateCreditTransaction.description);
  expect(outputGetDebitTransaction.value).toEqual(inputCreateCreditTransaction.value * 10);
  expect(outputGetDebitTransaction.categoryId).toEqual(inputCreateCreditTransaction.categoryId);
  expect(outputGetDebitTransaction.installments!.length).toEqual(10);
  const [firstInstallment] = outputGetDebitTransaction.installments!;
  expect(firstInstallment.date).toEqual(inputCreateCreditTransaction.date);
  expect(firstInstallment.value).toEqual(inputCreateCreditTransaction.value);
  expect(firstInstallment.installmentNumber).toEqual(1);
});

test("Não deve criar uma transação de crédito se a categoria não existir", async () => {
  await expect(() =>
    createCreditTransaction.execute(CreditTransactionDummy.create({ categoryId: crypto.randomUUID() }))
  ).rejects.toThrowError("[CreateCreditTransaction] Category not found");
});

afterAll(async () => {
  await databaseConnection.disconnect();
});
