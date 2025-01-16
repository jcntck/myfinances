import CreateCategory from "@/core/application/usecase/category/CreateCategory";
import CreateCreditTransaction from "@/core/application/usecase/credit-transactions/CreateCreditTransaction";
import DeleteCreditTransaction from "@/core/application/usecase/credit-transactions/DeleteCreditTransaction";
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
let deleteCreditTransaction: DeleteCreditTransaction;

beforeAll(() => {
  databaseConnection = new PgPromiseAdapter();
  const categoryRepository = new CategoryRepositoryDatabase(databaseConnection);
  createCategory = new CreateCategory(categoryRepository);
  const transactionRepository = new TransactionRepositoryDatabase(databaseConnection);
  createCreditTransaction = new CreateCreditTransaction(transactionRepository, categoryRepository);
  updateCreditTransaction = new UpdateCreditTransaction(transactionRepository, categoryRepository);
  getCreditTransaction = new GetCreditTransaction(transactionRepository);
  deleteCreditTransaction = new DeleteCreditTransaction(transactionRepository);
});

test("Deve deletar uma transação", async () => {
  const category1 = await createCategory.execute(CategoryDummy.create());
  const inputCreateCreditTransaction = CreditTransactionDummy.create({ categoryId: category1.categoryId });
  const outputCreateCreditTransaction = await createCreditTransaction.execute(inputCreateCreditTransaction);
  await deleteCreditTransaction.execute(outputCreateCreditTransaction.transactionId);
  await expect(() => getCreditTransaction.execute(outputCreateCreditTransaction.transactionId)).rejects.toThrowError(
    "[GetCreditTransaction] Credit transaction not found"
  );
});
