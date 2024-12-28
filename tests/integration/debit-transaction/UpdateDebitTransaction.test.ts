import CreateCategory from "@/application/usecase/category/CreateCategory";
import CreateDebitTransaction from "@/application/usecase/debit-transactions/CreateDebitTransaction";
import GetDebitTransaction from "@/application/usecase/debit-transactions/GetDebitTransaction";
import UpdateDebitTransaction from "@/application/usecase/debit-transactions/UpdateDebitTransaction";
import DatabaseConnection, { PgPromiseAdapter } from "@/infra/database/DatabaseConnection";
import { CategoryRepositoryDatabase } from "@/infra/repository/CategoryRepository";
import { TransactionRepositoryDatabase } from "@/infra/repository/TransactionRepository";
import { beforeAll, expect, test } from "vitest";
import DebitTransactionDummy from "@/tests/dummies/DebitTransactionDummy";
import CategoryDummy from "@/tests/dummies/CategoryDummy";

let databaseConnection: DatabaseConnection;
let createCategory: CreateCategory;
let createDebitTransaction: CreateDebitTransaction;
let updateDebitTransaction: UpdateDebitTransaction;
let getDebitTransaction: GetDebitTransaction;

beforeAll(() => {
  databaseConnection = new PgPromiseAdapter();
  const categoryRepository = new CategoryRepositoryDatabase(databaseConnection);
  createCategory = new CreateCategory(categoryRepository);
  const debitTransactionRepository = new TransactionRepositoryDatabase(databaseConnection);
  createDebitTransaction = new CreateDebitTransaction(debitTransactionRepository, categoryRepository);
  updateDebitTransaction = new UpdateDebitTransaction(debitTransactionRepository, categoryRepository);
  getDebitTransaction = new GetDebitTransaction(debitTransactionRepository);
});

test("Deve atualizar uma transação de débito", async () => {
  const category1 = await createCategory.execute(CategoryDummy.create());
  const category2 = await createCategory.execute(CategoryDummy.create());
  const inputCreateDebitTransaction = DebitTransactionDummy.create({
    categoryId: category1.categoryId,
  });
  const outputCreateDebitTransaction = await createDebitTransaction.execute(inputCreateDebitTransaction);
  const inputUpdateDebitTransaction = DebitTransactionDummy.update({
    transactionId: outputCreateDebitTransaction.transactionId,
    categoryId: category2.categoryId,
  });
  await updateDebitTransaction.execute(inputUpdateDebitTransaction);
  const outputGetDebitTransaction = await getDebitTransaction.execute(outputCreateDebitTransaction.transactionId);
  expect(outputGetDebitTransaction.description).toBe(inputUpdateDebitTransaction.description);
  expect(outputGetDebitTransaction.categoryId).toBe(inputUpdateDebitTransaction.categoryId);
});

test("Não deve atualizar uma transação que não existe", async () => {
  const inputUpdateDebitTransaction = DebitTransactionDummy.update({
    transactionId: crypto.randomUUID(),
    categoryId: crypto.randomUUID(),
  });
  await expect(() => updateDebitTransaction.execute(inputUpdateDebitTransaction)).rejects.toThrowError(
    "[UpdateDebitTransaction] Debit transaction not found"
  );
});

test("Não deve atualizar uma transação se a categoria não existir", async () => {
  const category1 = await createCategory.execute(CategoryDummy.create());
  const inputCreateDebitTransaction = DebitTransactionDummy.create({
    categoryId: category1.categoryId,
  });
  const outputCreateDebitTransaction = await createDebitTransaction.execute(inputCreateDebitTransaction);
  const inputUpdateDebitTransaction = DebitTransactionDummy.update({
    transactionId: outputCreateDebitTransaction.transactionId,
    categoryId: crypto.randomUUID(),
  });
  await expect(() => updateDebitTransaction.execute(inputUpdateDebitTransaction)).rejects.toThrowError(
    "[UpdateDebitTransaction] Category not found"
  );
});
