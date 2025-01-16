import Category from "@/core/domain/entities/Category";
import { expect, test } from "vitest";

test("Não deve criar uma categoria sem nome", () => {
  expect(() => Category.create({ name: "" })).toThrowError("[Category] name is required");
});
