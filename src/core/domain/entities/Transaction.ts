import UUID from "@/core/domain/vo/UUID";

export enum TransactionStatus {
  PENDING = "pending",
  PAID = "paid",
}

export enum TransactionType {
  DEBIT = "debit",
  CREDIT = "credit",
}

export default class Transaction {
  private _id: UUID;
  private _categoryId: UUID;

  constructor(
    id: string,
    readonly date: Date,
    readonly description: string,
    readonly value: number,
    categoryId: string,
    readonly status: TransactionStatus,
    readonly type: TransactionType
  ) {
    this._id = new UUID(id);
    if (!description) throw new Error("[Transaction] description cannot be empty");
    if (!categoryId) throw new Error("[Transaction] categoryId cannot be empty");
    if (!value) throw new Error("[Transaction] value cannot be 0");
    this._categoryId = new UUID(categoryId);
    if (!status) throw new Error("[Transaction] status cannot be empty");
    if (status !== TransactionStatus.PENDING && status !== TransactionStatus.PAID)
      throw new Error("[Transaction] status must be pending or paid");
    if (!type) throw new Error("[Transaction] type cannot be empty");
    if (type !== TransactionType.CREDIT && type !== TransactionType.DEBIT)
      throw new Error("[Transaction] type must be credit or debit");
  }

  get id(): string {
    return this._id.getValue();
  }

  get categoryId(): string {
    return this._categoryId.getValue();
  }
}
