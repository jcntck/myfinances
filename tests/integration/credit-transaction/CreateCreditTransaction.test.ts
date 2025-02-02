import TransactionRepository from "@/core/application/repository/TransactionRepository";
import CreateCategory from "@/core/application/usecase/category/CreateCategory";
import CreateCreditTransaction from "@/core/application/usecase/credit-transactions/CreateCreditTransaction";
import GetCreditTransaction from "@/core/application/usecase/credit-transactions/GetCreditTransaction";
import CreditTransaction from "@/core/domain/entities/CreditTransaction";
import DatabaseConnection, { PgPromiseAdapter } from "@/core/infra/database/DatabaseConnection";
import { CategoryRepositoryDatabase } from "@/core/infra/repository/CategoryRepositoryDatabase";
import { CreditTransactionRepositoryDatabase } from "@/core/infra/repository/CreditTransactionRepositoryDatabase";
import CategoryDummy from "@/tests/dummies/CategoryDummy";
import CreditTransactionDummy from "@/tests/dummies/CreditTransactionDummy";
import { afterAll, beforeAll, expect, test } from "vitest";

let databaseConnection: DatabaseConnection;
let transactionRepository: TransactionRepository;
let createCategory: CreateCategory;
let createCreditTransaction: CreateCreditTransaction;
let getCreditTransaction: GetCreditTransaction;

beforeAll(() => {
  databaseConnection = new PgPromiseAdapter();
  const categoryRepository = new CategoryRepositoryDatabase(databaseConnection);
  createCategory = new CreateCategory(categoryRepository);
  transactionRepository = new CreditTransactionRepositoryDatabase(databaseConnection);
  createCreditTransaction = new CreateCreditTransaction(transactionRepository, categoryRepository);
  getCreditTransaction = new GetCreditTransaction(transactionRepository);
});

test("Deve criar uma transação de crédito", async () => {
  const { categoryId } = await createCategory.execute(CategoryDummy.create());
  const inputCreateCreditTransaction = CreditTransactionDummy.create({ categoryId });
  const { transactionId } = await createCreditTransaction.execute(inputCreateCreditTransaction);
  expect(transactionId).toBeDefined();

  const outputGetDebitTransaction = await getCreditTransaction.execute(transactionId!);
  expect(outputGetDebitTransaction.id).toEqual(transactionId);
  expect(outputGetDebitTransaction.date).toEqual(inputCreateCreditTransaction.date);
  expect(outputGetDebitTransaction.description).toEqual(inputCreateCreditTransaction.description);
  expect(outputGetDebitTransaction.value).toEqual(inputCreateCreditTransaction.value);
  expect(outputGetDebitTransaction.categoryId).toEqual(inputCreateCreditTransaction.categoryId);
  expect(outputGetDebitTransaction.status).toEqual("pending");
  expect(outputGetDebitTransaction.type).toEqual("credit");
});

test("Deve criar uma transação de crédito parcelada", async () => {
  const { categoryId } = await createCategory.execute(CategoryDummy.create());
  const inputCreateCreditTransaction = CreditTransactionDummy.create({ categoryId, numberOfInstallments: 10 });
  const { installmentId } = await createCreditTransaction.execute(inputCreateCreditTransaction);
  expect(installmentId).toBeDefined();

  const installment = await transactionRepository.findInstallmentById(installmentId!);
  expect(installment).toBeDefined();
  expect(installment!.id).toBeDefined();
  expect(installment!.totalValue).toBeDefined();
  expect(installment!.description).toBeDefined();
  expect(installment!.transactions).toBeDefined();
  expect(Array.isArray(installment!.transactions)).toBe(true);
  const [transaction] = installment!.transactions;
  expect(transaction.status).toBe("pending");
});

test("Deve criar uma transação de crédito recorrente", async () => {
  const { categoryId } = await createCategory.execute(CategoryDummy.create());
  const inputCreateCreditTransaction = CreditTransactionDummy.create({ categoryId, isRecurring: true });
  await createCreditTransaction.execute(inputCreateCreditTransaction);

  const transactions = await transactionRepository.findAllRecurringTransactions(
    inputCreateCreditTransaction.description
  );

  expect(Array.isArray(transactions)).toBe(true);
  expect(transactions.length).toBe(CreditTransaction.RECURRING_NEXT_MONTHS);
});

test("Não deve criar uma transação de crédito se a categoria não existir", async () => {
  await expect(() =>
    createCreditTransaction.execute(CreditTransactionDummy.create({ categoryId: crypto.randomUUID() }))
  ).rejects.toThrowError("[CreateCreditTransaction] Category not found");
});

afterAll(async () => {
  await databaseConnection.disconnect();
});
