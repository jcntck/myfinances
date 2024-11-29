export default class CategoryDummy {
  static create(): CreateOutput {
    return { name: `Category ${Date.now()}${Math.floor(Math.random() * 90 + 10)}` };
  }

  static update(input: UpdateInput): UpdateOutput {
    return {
      id: input.categoryId,
      name: input.name ?? `Category ${Date.now()}${Math.floor(Math.random() * 90 + 10)}`,
    };
  }
}

type CreateOutput = {
  name: string;
};

type UpdateInput = {
  categoryId: string;
  name?: string;
};

type UpdateOutput = {
  id: string;
  name: string;
};
