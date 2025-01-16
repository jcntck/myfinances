import ListCreditTransactionsByRange from "@/core/application/usecase/credit-transactions/ListCreditTransactionsByRange";
import TransactionDAODatabase from "@/core/infra/dao/TransactionDaoDatabase";
import DatabaseConnection, { PgPromiseAdapter } from "@/core/infra/database/DatabaseConnection";
import { addMonths, subMonths } from "date-fns";
import { afterAll, beforeAll, expect, test } from "vitest";

let databaseConnection: DatabaseConnection;
let listCreditTransactionsByRange: ListCreditTransactionsByRange;

beforeAll(() => {
  databaseConnection = new PgPromiseAdapter();
  const transactionDAO = new TransactionDAODatabase(databaseConnection);
  listCreditTransactionsByRange = new ListCreditTransactionsByRange(transactionDAO);
});

test("Deve retornar uma lista de transações de crédito por data", async () => {
  const startDate = subMonths(new Date(), 2);
  const endDate = new Date();

  const output = await listCreditTransactionsByRange.execute({ startDate, endDate });

  expect(output).toBeDefined();
  expect(Array.isArray(output)).toBeTruthy();
  expect(output[0].id).toBeDefined();
  expect(output[0].date).toBeDefined();
  expect(output[0].description).toBeDefined();
  expect(output[0].value).toBeDefined();
  expect(output[0].type).toBeDefined();
  expect(output[0].categoryId).toBeDefined();
  expect(output[0].categoryName).toBeDefined();
});

afterAll(async () => {
  await databaseConnection.disconnect();
});
