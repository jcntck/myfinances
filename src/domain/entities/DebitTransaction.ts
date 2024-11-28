import UUID from "@/domain/vo/UUID";

export default class DebitTransaction {
  private _id: UUID;
  private _categoryId: UUID;

  constructor(
    id: string,
    readonly date: Date,
    readonly description: string,
    readonly value: number,
    categoryId: string
  ) {
    this._id = new UUID(id);
    if (!description) throw new Error("[DebitTransaction] description cannot be empty");
    if (!categoryId) throw new Error("[DebitTransaction] categoryId cannot be empty");
    if (!value) throw new Error("[DebitTransaction] value cannot be 0");
    this._categoryId = new UUID(categoryId);
  }

  get id(): string {
    return this._id.getValue();
  }

  get categoryId(): string {
    return this._categoryId.getValue();
  }

  static create(date: Date, description: string, value: number, categoryId: string) {
    const id = UUID.create().getValue();
    return new DebitTransaction(id, date, description, value, categoryId);
  }
}
