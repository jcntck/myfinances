import UUID from "@/core/domain/vo/UUID";
import { addMonths } from "date-fns";
import Transaction, { TransactionStatus, TransactionType } from "./Transaction";

export default class CreditTransaction extends Transaction {
  static RECURRING_NEXT_MONTHS = 12;

  constructor(
    id: string,
    date: Date,
    description: string,
    value: number,
    categoryId: string,
    status: TransactionStatus,
    type: TransactionType,
    readonly isRecurring: boolean = false
  ) {
    super(id, date, description, value, categoryId, status, type);
  }

  static create(date: Date, description: string, value: number, categoryId: string, isRecurring?: boolean) {
    const id = UUID.create().getValue();
    return new CreditTransaction(
      id,
      date,
      description,
      value,
      categoryId,
      TransactionStatus.PENDING,
      TransactionType.CREDIT,
      isRecurring
    );
  }

  createNextRecurringTransactions(): CreditTransaction[] {
    if (!this.isRecurring) throw new Error("[CreditTransaction] Transaction is not recurring");

    const transactions = [];
    for (let index = 1; index < CreditTransaction.RECURRING_NEXT_MONTHS; index++) {
      const newTransaction = CreditTransaction.create(
        addMonths(this.date, index),
        this.description,
        this.value,
        this.categoryId,
        true
      );
      transactions.push(newTransaction);
    }

    return transactions;
  }
}
