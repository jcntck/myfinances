import CreateCategory from "@/application/usecase/category/CreateCategory";
import CreateDebitTransaction from "@/application/usecase/debit-transactions/CreateDebitTransaction";
import DeleteDebitTransaction from "@/application/usecase/debit-transactions/DeleteDebitTransaction";
import GetDebitTransaction from "@/application/usecase/debit-transactions/GetDebitTransaction";
import DatabaseConnection, { PgPromiseAdapter } from "@/infra/database/DatabaseConnection";
import { CategoryRepositoryDatabase } from "@/infra/repository/CategoryRepository";
import { DebitTransactionDatabase } from "@/infra/repository/DebitTransactionRepository";
import CategoryDummy from "@/tests/dummies/CategoryDummy";
import DebitTransactionDummy from "@/tests/dummies/DebitTransactionDummy";
import { beforeAll, expect, test } from "vitest";

let databaseConnection: DatabaseConnection;
let createCategory: CreateCategory;
let createDebitTransaction: CreateDebitTransaction;
let getDebitTransaction: GetDebitTransaction;
let deleteDebitTransaction: DeleteDebitTransaction;

beforeAll(() => {
  databaseConnection = new PgPromiseAdapter();
  const categoryRepository = new CategoryRepositoryDatabase(databaseConnection);
  createCategory = new CreateCategory(categoryRepository);
  const debitTransactionRepository = new DebitTransactionDatabase(databaseConnection);
  createDebitTransaction = new CreateDebitTransaction(debitTransactionRepository, categoryRepository);
  getDebitTransaction = new GetDebitTransaction(debitTransactionRepository);
  deleteDebitTransaction = new DeleteDebitTransaction(debitTransactionRepository);
});

test("Deve deletar uma transação", async () => {
  const category1 = await createCategory.execute(CategoryDummy.create());
  const inputCreateDebitTransaction = DebitTransactionDummy.create({ categoryId: category1.categoryId });
  const outputCreateDebitTransaction = await createDebitTransaction.execute(inputCreateDebitTransaction);
  await deleteDebitTransaction.execute(outputCreateDebitTransaction.transactionId);
  await expect(() => getDebitTransaction.execute(outputCreateDebitTransaction.transactionId)).rejects.toThrowError(
    "[GetDebitTransaction] Debit transaction not found"
  );
});
