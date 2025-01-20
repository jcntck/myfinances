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
