import CreditTransaction from "@/core/domain/entities/CreditTransaction";
import UUID from "@/core/domain/vo/UUID";
import { expect, test } from "vitest";
import { addMonths } from "date-fns";

test("Deve criar uma transação de crédito parcelada", () => {
  const initialDate = new Date();
  const transaction = {
    date: initialDate,
    description: "Description 1",
    value: 10,
    categoryId: UUID.create().getValue(),
    installments: 10,
  };

  const creditTransaction = CreditTransaction.create(
    transaction.date,
    transaction.description,
    transaction.value,
    transaction.categoryId,
    transaction.installments
  );

  expect(Array.isArray(creditTransaction.installments)).toBe(true);
  expect(creditTransaction.value).toBe(transaction.value * transaction.installments);
  expect(creditTransaction.installments).toBeDefined();
  expect(creditTransaction.installments!.length).toBe(transaction.installments);
  const lastInstallment = creditTransaction.installments![creditTransaction.installments!.length - 1];
  expect(lastInstallment.date).toEqual(addMonths(initialDate, transaction.installments - 1));
  expect(lastInstallment.value).toEqual(transaction.value);
});

test("Deve criar uma transação de crédito recorrente e seus próximos 12 meses de transações", () => {
  const initialDate = new Date();
  const transaction = {
    date: new Date(),
    description: "Description 1",
    value: 10,
    categoryId: UUID.create().getValue(),
    isRecurring: true,
  };

  const creditTransaction = CreditTransaction.create(
    transaction.date,
    transaction.description,
    transaction.value,
    transaction.categoryId,
    undefined,
    transaction.isRecurring
  );

  expect(creditTransaction.isRecurring).toBe(true);

  const transactions = creditTransaction.createNextRecurringTransactions();

  expect(Array.isArray(transactions)).toBe(true);
  expect(transactions.length).toBe(12);
  expect(transactions[0].date).toEqual(addMonths(initialDate, 1));
});

test("Não deve gerar as proximas transações recorrentes se a transação nao for recorrente", () => {
  const transaction = {
    date: new Date(),
    description: "Description 1",
    value: 10,
    categoryId: UUID.create().getValue(),
  };

  const creditTransaction = CreditTransaction.create(
    transaction.date,
    transaction.description,
    transaction.value,
    transaction.categoryId
  );

  expect(() => creditTransaction.createNextRecurringTransactions()).toThrowError(
    "[CreditTransaction] Transaction is not recurring"
  );
});

test("Não deve permitir criar uma transação de crédito parcelada e recorrente", () => {
  const transaction = {
    date: new Date(),
    description: "Description 1",
    value: 10,
    categoryId: UUID.create().getValue(),
    installments: 10,
    isRecurring: true,
  };

  expect(() =>
    CreditTransaction.create(
      transaction.date,
      transaction.description,
      transaction.value,
      transaction.categoryId,
      transaction.installments,
      transaction.isRecurring
    )
  ).toThrowError(
    "[CreditTransaction] Cannot create a recurring transaction and installment transaction at the same time"
  );
});
