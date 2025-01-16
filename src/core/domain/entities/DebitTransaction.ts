import UUID from "@/core/domain/vo/UUID";
import Transaction, { TransactionStatus, TransactionType } from "./Transaction";

export default class DebitTransaction extends Transaction {
  constructor(
    id: string,
    date: Date,
    description: string,
    value: number,
    categoryId: string,
    status: TransactionStatus,
    type: TransactionType
  ) {
    super(id, date, description, value, categoryId, status, type);
  }

  static create(date: Date, description: string, value: number, categoryId: string) {
    const id = UUID.create().getValue();
    return new DebitTransaction(
      id,
      date,
      description,
      value,
      categoryId,
      TransactionStatus.PENDING,
      TransactionType.DEBIT
    );
  }
}
