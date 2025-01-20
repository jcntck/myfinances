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
  private _value: number;
  private _categoryId: UUID;
  private _status: TransactionStatus;

  constructor(
    id: string,
    readonly date: Date,
    readonly description: string,
    value: number,
    categoryId: string,
    status: TransactionStatus,
    readonly type: TransactionType
  ) {
    this._id = new UUID(id);
    if (!description) throw new Error("[Transaction] description cannot be empty");
    if (!categoryId) throw new Error("[Transaction] categoryId cannot be empty");
    this._categoryId = new UUID(categoryId);
    if (!value) throw new Error("[Transaction] value cannot be 0");
    this._value = value;
    if (!status) throw new Error("[Transaction] status cannot be empty");
    if (status !== TransactionStatus.PENDING && status !== TransactionStatus.PAID)
      throw new Error("[Transaction] status must be pending or paid");
    this._status = status;
    if (!type) throw new Error("[Transaction] type cannot be empty");
    if (type !== TransactionType.CREDIT && type !== TransactionType.DEBIT)
      throw new Error("[Transaction] type must be credit or debit");
  }

  get id(): string {
    return this._id.getValue();
  }

  get value(): number {
    return this._value;
  }

  set value(value: number) {
    if (!value) throw new Error("[Transaction] value cannot be 0");
    this._value = value;
  }

  get categoryId(): string {
    return this._categoryId.getValue();
  }

  get status(): TransactionStatus {
    return this._status;
  }

  paid() {
    this._status = TransactionStatus.PAID;
  }

  isSame(transaction: Transaction) {
    return (
      this.date.getUTCMilliseconds() === transaction.date.getUTCMilliseconds() &&
      this.description === transaction.description &&
      this.value === transaction.value
    );
  }
}
