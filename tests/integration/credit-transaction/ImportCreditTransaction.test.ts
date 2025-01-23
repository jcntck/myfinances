import CreateCategory from "@/core/application/usecase/category/CreateCategory";
import CreateCreditTransaction from "@/core/application/usecase/credit-transactions/CreateCreditTransaction";
import GetCreditTransaction from "@/core/application/usecase/credit-transactions/GetCreditTransaction";
import ImportCreditTransactions from "@/core/application/usecase/credit-transactions/ImportCreditTransactions";
import CreditTransaction from "@/core/domain/entities/CreditTransaction";
import DatabaseConnection, { PgPromiseAdapter } from "@/core/infra/database/DatabaseConnection";
import { CategoryRepositoryDatabase } from "@/core/infra/repository/CategoryRepositoryDatabase";
import { CreditTransactionRepositoryDatabase } from "@/core/infra/repository/CreditTransactionRepositoryDatabase";
import CategoryDummy from "@/tests/dummies/CategoryDummy";
import CreditTransactionDummy from "@/tests/dummies/CreditTransactionDummy";
import { beforeAll, expect, test } from "vitest";

let databaseConnection: DatabaseConnection;
let createCategory: CreateCategory;
let transactionRepository: CreditTransactionRepositoryDatabase;
let importCreditTransactions: ImportCreditTransactions;
let getCreditTransaction: GetCreditTransaction;
let createCreditTransaction: CreateCreditTransaction;

beforeAll(() => {
  databaseConnection = new PgPromiseAdapter();
  const categoryRepository = new CategoryRepositoryDatabase(databaseConnection);
  createCategory = new CreateCategory(categoryRepository);
  transactionRepository = new CreditTransactionRepositoryDatabase(databaseConnection);
  importCreditTransactions = new ImportCreditTransactions(transactionRepository, categoryRepository);
  getCreditTransaction = new GetCreditTransaction(transactionRepository);
  createCreditTransaction = new CreateCreditTransaction(transactionRepository, categoryRepository);
});

test("Deve importar todas as transações de crédito da lista", async () => {
  const category = CategoryDummy.create();
  const { categoryId } = await createCategory.execute(category);
  const transactionsList = Array.from({ length: 5 }, () => CreditTransactionDummy.create({ categoryId }));
  transactionsList.push(
    CreditTransactionDummy.create({ description: `Parcelada ${Date.now()}`, categoryId, numberOfInstallments: 3 })
  );
  transactionsList.push(
    CreditTransactionDummy.create({ description: `Recorrente ${Date.now()}`, categoryId, isRecurring: true }),
    CreditTransactionDummy.create({ description: `Recorrente ${Date.now()} #2`, categoryId, isRecurring: true })
  );

  await importCreditTransactions.execute(transactionsList);

  const [defaultResult] = await databaseConnection.query(
    "select count(*)::integer from myfinances.transactions where description in ($1:csv)",
    [transactionsList.filter((t) => !t.isRecurring && !t.numberOfInstallments).map((t) => t.description)]
  );
  expect(defaultResult.count).toEqual(transactionsList.filter((t) => !t.isRecurring && !t.numberOfInstallments).length);

  const [installmentResult] = await databaseConnection.query(
    "select COUNT(*)::integer from myfinances.installments AS i JOIN myfinances.transaction_installment AS ti ON ti.installment_id = i.id where description = $1",
    [transactionsList.find((t) => t.numberOfInstallments)?.description]
  );
  expect(installmentResult.count).toEqual(transactionsList.find((t) => t.numberOfInstallments)?.numberOfInstallments);

  const [recurringResult] = await databaseConnection.query(
    "select count(*)::integer from myfinances.transactions where description in ($1:csv)",
    [transactionsList.filter((t) => t.isRecurring).map((t) => t.description)]
  );
  expect(recurringResult.count).toEqual(
    transactionsList.filter((t) => t.isRecurring).length * CreditTransaction.RECURRING_NEXT_MONTHS
  );
});

test("Não deve criar parcelas duplicadas", async () => {
  const category = CategoryDummy.create();
  const { categoryId } = await createCategory.execute(category);
  const installment = CreditTransactionDummy.create({
    description: "Transação parcelada",
    categoryId,
    numberOfInstallments: 3,
  });
  await importCreditTransactions.execute([installment]);
  await importCreditTransactions.execute([installment]);

  const [result] = await databaseConnection.query(
    "select count(*)::integer from myfinances.installments where description = $1 and total_value = $2",
    [installment.description, installment.value * installment.numberOfInstallments!]
  );

  expect(result.count).toEqual(1);
});

test("Não deve criar recorrência duplicada", async () => {
  const category = CategoryDummy.create();
  const { categoryId } = await createCategory.execute(category);
  const recorrency = CreditTransactionDummy.create({
    description: `Transação recorrente ${Date.now()} #1`,
    categoryId,
    isRecurring: true,
  });

  await importCreditTransactions.execute([recorrency]);
  await importCreditTransactions.execute([recorrency]);

  const [recurringResult] = await databaseConnection.query(
    "select count(*)::integer from myfinances.transactions where description in ($1:csv) and date = $2",
    [recorrency.description, recorrency.date]
  );

  expect(recurringResult.count).toEqual(1);
});

test("Deve atualizar o status das transações para 'paid' ao importar dados", async () => {
  const date = new Date();
  const category = CategoryDummy.create();
  const { categoryId } = await createCategory.execute(category);
  const defaultTransaction = CreditTransactionDummy.create({ date, categoryId });
  const installmentTransaction = CreditTransactionDummy.create({
    date,
    description: `Transação parcelada ${Date.now()} #1`,
    categoryId,
    numberOfInstallments: 3,
  });
  const recurrencyTransaction = CreditTransactionDummy.create({
    date,
    description: `Transação recorrente ${Date.now()} #2`,
    categoryId,
    isRecurring: true,
  });
  const { transactionId } = await createCreditTransaction.execute(defaultTransaction);
  const { installmentId } = await createCreditTransaction.execute(installmentTransaction);
  const { transactionId: recurrencyTransactionId } = await createCreditTransaction.execute(recurrencyTransaction);

  await importCreditTransactions.execute([defaultTransaction, installmentTransaction, recurrencyTransaction]);

  const result = await databaseConnection.query(
    "SELECT * FROM myfinances.transactions AS t LEFT JOIN myfinances.transaction_installment ti ON t.id = ti.transaction_id WHERE t.id IN ($1:csv) OR ti.installment_id = $2 AND DATE = $3",
    [[transactionId, recurrencyTransactionId], installmentId, date]
  );

  for (const transaction of result) {
    expect(transaction.status).toBe("paid");
  }
});
