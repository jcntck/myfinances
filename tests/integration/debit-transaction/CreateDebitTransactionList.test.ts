import CreateCategory from "@/core/application/usecase/category/CreateCategory";
import CreateDebitTransaction from "@/core/application/usecase/debit-transactions/CreateDebitTransaction";
import GetDebitTransaction from "@/core/application/usecase/debit-transactions/GetDebitTransaction";
import DatabaseConnection, { PgPromiseAdapter } from "@/core/infra/database/DatabaseConnection";
import { CategoryRepositoryDatabase } from "@/core/infra/repository/CategoryRepositoryDatabase";
import { TransactionRepositoryDatabase } from "@/core/infra/repository/TransactionRepositoryDatabase";
import { afterAll, afterEach, beforeAll, expect, test } from "vitest";
import DebitTransactionDummy from "@/tests/dummies/DebitTransactionDummy";
import CategoryDummy from "@/tests/dummies/CategoryDummy";
import CreateDebitTransactionList from "@/core/application/usecase/debit-transactions/CreateDebitTransactionList";

let databaseConnection: DatabaseConnection;
let createCategory: CreateCategory;
let createDebitTransactionList: CreateDebitTransactionList;
let getDebitTransaction: GetDebitTransaction;
let createDebitTransaction: CreateDebitTransaction;

// let dataToDelete: { table: string; id: string }[] = [];

// async function deleteData() {
//   const statements = dataToDelete.map(({ table, id }) => {
//     return databaseConnection.buildStatement(`DELETE FROM ${table} WHERE id = '${id}';`);
//   });
//   await databaseConnection.transaction(statements, "clean-tests");
// }

beforeAll(() => {
  databaseConnection = new PgPromiseAdapter();
  const categoryRepository = new CategoryRepositoryDatabase(databaseConnection);
  createCategory = new CreateCategory(categoryRepository);
  const debitTransactionRepository = new TransactionRepositoryDatabase(databaseConnection);
  createDebitTransactionList = new CreateDebitTransactionList(debitTransactionRepository, categoryRepository);
  getDebitTransaction = new GetDebitTransaction(debitTransactionRepository);
  createDebitTransaction = new CreateDebitTransaction(debitTransactionRepository, categoryRepository);
});

afterAll(async () => {
  // await deleteData();
});

test("Deve criar todas as transações de débito da lista", async () => {
  const category = CategoryDummy.create();
  const { categoryId } = await createCategory.execute(category);
  const transactionsList = Array.from({ length: 10 }, () => DebitTransactionDummy.create({ categoryId }));

  const ids = await createDebitTransactionList.execute(transactionsList);
  for (const transactionId of ids) {
    const transaction = await getDebitTransaction.execute(transactionId);
    expect(transaction.id).toEqual(transactionId);
    expect(transaction.status).toEqual("paid");
    expect(transaction.type).toEqual("debit");
  }

  // dataToDelete = [
  //   ...dataToDelete,
  //   { table: "myfinances.categories", id: categoryId },
  //   ...ids.map((id) => ({ table: "myfinances.transactions", id })),
  // ];
});

test("Deve retornar erro se houver categorias que não existem", async () => {
  const transactionsList = Array.from({ length: 5 }, () =>
    DebitTransactionDummy.create({ categoryId: crypto.randomUUID() })
  );
  await expect(createDebitTransactionList.execute(transactionsList)).rejects.toThrow(
    "[CreateDebitTransactionList] Category not found"
  );
});

test("Deve criar apenas as transações que não existem", async () => {
  const category = CategoryDummy.create();
  const { categoryId } = await createCategory.execute(category);
  const alreadyCreated = DebitTransactionDummy.create({ categoryId });
  await createDebitTransaction.execute(alreadyCreated);
  const transactionsList = Array.from({ length: 10 }, () => DebitTransactionDummy.create({ categoryId }));
  transactionsList.push(alreadyCreated);

  const ids = await createDebitTransactionList.execute(transactionsList);
  expect(ids.length).toEqual(10);
});
