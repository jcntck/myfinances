import TransactionRepository from "@/core/application/repository/TransactionRepository";
import CreateCategory from "@/core/application/usecase/category/CreateCategory";
import CreateCreditTransaction from "@/core/application/usecase/credit-transactions/CreateCreditTransaction";
import GetCreditTransaction from "@/core/application/usecase/credit-transactions/GetCreditTransaction";
import UpdateCreditTransaction from "@/core/application/usecase/credit-transactions/UpdateCreditTransaction";
import CreditTransaction from "@/core/domain/entities/CreditTransaction";
import DatabaseConnection, { PgPromiseAdapter } from "@/core/infra/database/DatabaseConnection";
import { CategoryRepositoryDatabase } from "@/core/infra/repository/CategoryRepositoryDatabase";
import { CreditTransactionRepositoryDatabase } from "@/core/infra/repository/CreditTransactionRepositoryDatabase";
import { TransactionRepositoryDatabase } from "@/core/infra/repository/TransactionRepositoryDatabase";
import CategoryDummy from "@/tests/dummies/CategoryDummy";
import CreditTransactionDummy from "@/tests/dummies/CreditTransactionDummy";
import { afterAll, beforeAll, expect, test } from "vitest";

let databaseConnection: DatabaseConnection;
let createCategory: CreateCategory;
let transactionRepository: TransactionRepository;
let createCreditTransaction: CreateCreditTransaction;
let updateCreditTransaction: UpdateCreditTransaction;
let getCreditTransaction: GetCreditTransaction;

beforeAll(() => {
  databaseConnection = new PgPromiseAdapter();
  const categoryRepository = new CategoryRepositoryDatabase(databaseConnection);
  createCategory = new CreateCategory(categoryRepository);
  transactionRepository = new CreditTransactionRepositoryDatabase(databaseConnection);
  createCreditTransaction = new CreateCreditTransaction(transactionRepository, categoryRepository);
  updateCreditTransaction = new UpdateCreditTransaction(transactionRepository, categoryRepository);
  getCreditTransaction = new GetCreditTransaction(transactionRepository);
});

afterAll(async () => {
  await databaseConnection.disconnect();
});

test("Deve atualizar uma transação de crédito", async () => {
  const category1 = await createCategory.execute(CategoryDummy.create());
  const category2 = await createCategory.execute(CategoryDummy.create());
  const inputCreateCreditTransaction = CreditTransactionDummy.create({
    categoryId: category1.categoryId,
  });
  const outputCreateCreditTransaction = await createCreditTransaction.execute(inputCreateCreditTransaction);
  const inputUpdateCreditTransaction = CreditTransactionDummy.update({
    transactionId: outputCreateCreditTransaction.transactionId!,
    categoryId: category2.categoryId,
  });
  await updateCreditTransaction.execute(inputUpdateCreditTransaction);
  const outputGetCreditTransaction = await getCreditTransaction.execute(outputCreateCreditTransaction.transactionId!);
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
    transactionId: outputCreateDebitTransaction.transactionId!,
    categoryId: crypto.randomUUID(),
  });
  await expect(() => updateCreditTransaction.execute(inputUpdateDebitTransaction)).rejects.toThrowError(
    "[UpdateCreditTransaction] Category not found"
  );
});

test("Deve atualizar os dados de uma compra parcelada", async () => {
  const category1 = await createCategory.execute(CategoryDummy.create());
  const category2 = await createCategory.execute(CategoryDummy.create());
  const inputCreateCreditTransaction = CreditTransactionDummy.create({
    categoryId: category1.categoryId,
    numberOfInstallments: 3,
  });
  const { installmentId } = await createCreditTransaction.execute(inputCreateCreditTransaction);
  const installment = await transactionRepository.findInstallmentById(installmentId!);
  const inputUpdateCreditTransaction = CreditTransactionDummy.update({
    transactionId: installment!.transactions[0].id,
    categoryId: category2.categoryId,
  });
  expect(installment!.description).toBe(inputCreateCreditTransaction.description);

  await updateCreditTransaction.execute(inputUpdateCreditTransaction);

  const [result] = await databaseConnection.query("select * from myfinances.installments where id = $1", [
    installmentId,
  ]);
  expect(result.description).toBe(inputUpdateCreditTransaction.description);

  const transactions = await databaseConnection.query(
    "select * from myfinances.transactions join myfinances.transaction_installment on myfinances.transactions.id = myfinances.transaction_installment.transaction_id where installment_id = $1",
    [installmentId]
  );
  expect(transactions.every((transaction: any) => transaction.category_id === category2.categoryId)).toBe(true);
});

test("Deve atualizar os dados de uma compra recorrente", async () => {
  const category1 = await createCategory.execute(CategoryDummy.create());
  const category2 = await createCategory.execute(CategoryDummy.create());
  const inputCreateCreditTransaction = CreditTransactionDummy.create({
    categoryId: category1.categoryId,
    isRecurring: true,
  });
  const outputCreateCreditTransaction = await createCreditTransaction.execute(inputCreateCreditTransaction);
  const inputUpdateCreditTransaction = CreditTransactionDummy.update({
    transactionId: outputCreateCreditTransaction.transactionId!,
    categoryId: category2.categoryId,
  });
  await updateCreditTransaction.execute(inputUpdateCreditTransaction);
  const recurringTransactions = await transactionRepository.findAllRecurringTransactions(
    inputUpdateCreditTransaction.description!
  );
  expect(recurringTransactions.length).toBe(CreditTransaction.RECURRING_NEXT_MONTHS);
  expect(recurringTransactions.every((transaction) => transaction.categoryId === category2.categoryId)).toBe(true);
});
