import UUID from "@/core/domain/vo/UUID";

export default class Category {
  private _id: UUID;

  constructor(id: string, readonly name: string) {
    if (!name) throw new Error("[Category] name is required");
    this._id = new UUID(id);
  }

  get id(): string {
    return this._id.getValue();
  }

  static create(input: { name: string }) {
    const id = UUID.create().getValue();
    return new Category(id, input.name);
  }
}
