import ListDebitTransactionsByRange from "@/core/application/usecase/debit-transactions/ListDebitTransactionsByRange";
import TransactionDAODatabase from "@/core/infra/dao/TransactionDaoDatabase";
import DatabaseConnection, { PgPromiseAdapter } from "@/core/infra/database/DatabaseConnection";
import { addMonths, subMonths } from "date-fns";
import { afterAll, beforeAll, expect, test } from "vitest";

let databaseConnection: DatabaseConnection;
let listDebitTransactionsByRange: ListDebitTransactionsByRange;

beforeAll(() => {
  databaseConnection = new PgPromiseAdapter();
  const transactionDAO = new TransactionDAODatabase(databaseConnection);
  listDebitTransactionsByRange = new ListDebitTransactionsByRange(transactionDAO);
});

test("Deve retornar uma lista de transações de débito por data", async () => {
  const startDate = new Date();
  const endDate = addMonths(startDate, 1);

  const output = await listDebitTransactionsByRange.execute({ startDate, endDate });

  expect(output).toBeDefined();
  expect(Array.isArray(output)).toBeTruthy();
  expect(output[0].id).toBeDefined();
  expect(output[0].date).toBeDefined();
  expect(output[0].description).toBeDefined();
  expect(output[0].value).toBeDefined();
  expect(output[0].type).toBeDefined();
  expect(output[0].status).toBeDefined();
  expect(output[0].categoryId).toBeDefined();
  expect(output[0].categoryName).toBeDefined();
});

afterAll(async () => {
  await databaseConnection.disconnect();
});
