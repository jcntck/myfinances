import CategoryRepository from "@/domain/repository/CategoryRepository";
import CategoryRepositoryFake from "@/infra/repository/CategoryRepository";
import { beforeAll, expect, test } from "vitest";

let categoryRepository: CategoryRepository;

beforeAll(() => {
  categoryRepository = new CategoryRepositoryFake();
});

test("Deve retornar undefined se a categoria não existir", async () => {
  const output = await categoryRepository.findById("1");
  expect(output).toBeUndefined();
});
