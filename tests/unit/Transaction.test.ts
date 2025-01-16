import DebitTransaction from "@/core/domain/entities/DebitTransaction";
import { expect, test } from "vitest";

test.each([
  {
    date: new Date(),
    description: "",
    value: 10,
    categoryId: "categoryId",
    missingField: "description",
  },
  {
    date: new Date(),
    description: "Description 1",
    value: 10,
    categoryId: "",
    missingField: "categoryId",
  },
])(
  "Não deve criar uma transação com campos do tipo string vazios. Campo: $missingField",
  ({ missingField, ...input }) => {
    expect(() => DebitTransaction.create(input.date, input.description, input.value, input.categoryId)).toThrowError(
      `[Transaction] ${missingField} cannot be empty`
    );
  }
);

test("Não deve criar uma transação se o valor for 0", () => {
  expect(() => DebitTransaction.create(new Date(), "Description 1", 0, "categoryId")).toThrowError(
    `[Transaction] value cannot be 0`
  );
});

test("Não deve criar uma transação com categoryId inválido", () => {
  expect(() => DebitTransaction.create(new Date(), "Description 1", 10, "categoryId")).toThrowError(`Invalid UUID`);
});
