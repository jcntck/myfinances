import UUID from "@/core/domain/vo/UUID";
import { test, expect } from "vitest";

test("Deve criar um UUID", () => {
  const uuid = UUID.create();
  expect(uuid.getValue()).toBeDefined();
});

test("Deve retornar erro se tentar criar um UUID inválido", () => {
  expect(() => new UUID("invalid-uuid")).toThrowError("Invalid UUID");
});
