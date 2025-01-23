import CreditTransaction from "@/core/domain/entities/CreditTransaction";
import UUID from "@/core/domain/vo/UUID";
import { expect, test } from "vitest";
import { addMonths } from "date-fns";
import CreditTransactionDummy from "@/tests/dummies/CreditTransactionDummy";
import Installment from "@/core/domain/entities/Installment";

test("Deve criar uma transação de crédito parcelada", () => {
  const numberOfInstallments = Math.ceil(Math.random() * 10);
  const transaction = CreditTransactionDummy.create({ categoryId: UUID.create().getValue() });

  const installment = Installment.create(
    transaction.date,
    transaction.description,
    transaction.value,
    transaction.categoryId,
    numberOfInstallments
  );

  expect(installment.id).toBeDefined();
  expect(installment.totalValue).toBe(transaction.value * numberOfInstallments);
  expect(installment.description).toBe(transaction.description);
  expect(installment.transactions.length).toBe(numberOfInstallments);

  const lastTransaction = installment.transactions[installment.transactions.length - 1];
  expect(lastTransaction.date.toISOString()).toEqual(
    addMonths(transaction.date, numberOfInstallments - 1).toISOString()
  );
});

test("Deve criar uma transação de crédito recorrente e seus próximos 12 meses de transações", () => {
  const initialDate = new Date();
  const transaction = {
    date: initialDate,
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
    transaction.isRecurring
  );

  expect(creditTransaction.isRecurring).toBe(true);
  const nextTransactions = creditTransaction.createNextRecurringTransactions();

  expect(Array.isArray(nextTransactions)).toBe(true);
  expect(nextTransactions.length).toBe(CreditTransaction.RECURRING_NEXT_MONTHS - 1);
  expect(nextTransactions[0].date.toISOString()).toEqual(addMonths(initialDate, 1).toISOString());
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
