import PageUtil from "@/core/infra/util/PageUtil";
import { expect, test } from "vitest";

test.each([
  [1, 10, 0],
  [10, 10, 90],
  [1, 25, 0],
  [2, 25, 25],
])("Deve calcular o offset corretamente dado a pagina [%i] informada com tamanho de [%i]", (page, size, expected) => {
  expect(PageUtil.calculateOffset(page, size)).toBe(expected);
});

test.each([
  [10, 10, 1],
  [90, 10, 9],
  [18, 25, 1],
  [26, 25, 2],
])(
  "Deve calcular a pagina corretamente dado o totalItems [%i] informado com tamanho de [%i]",
  (totalItems, size, expected) => {
    expect(PageUtil.calculatePage(totalItems, size)).toBe(expected);
  }
);
