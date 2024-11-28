import crypto from "node:crypto";

export default class Category {
  constructor(readonly id: string, readonly name: string) {
    if (!name) throw new Error("[Category] name is required");
  }

  static create(input: { name: string }) {
    const id = crypto.randomUUID();
    return new Category(id, input.name);
  }
}
