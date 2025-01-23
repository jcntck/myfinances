import CreditTransaction from "@/core/domain/entities/CreditTransaction";
import UUID from "@/core/domain/vo/UUID";
import { addMonths } from "date-fns";

export default class Installment {
  private _id: UUID;

  constructor(
    id: string,
    readonly totalValue: number,
    readonly description: string,
    readonly transactions: CreditTransaction[]
  ) {
    this._id = new UUID(id);
  }

  get id(): string {
    return this._id.getValue();
  }

  static create(date: Date, description: string, value: number, categoryId: string, numberOfInstallments: number) {
    const id = UUID.create().getValue();
    const transactions = Array.from({ length: numberOfInstallments }).map((_, index) => {
      const dueDate = addMonths(date, index);
      return CreditTransaction.create(dueDate, description, value, categoryId);
    });
    return new Installment(id, value * numberOfInstallments, description, transactions);
  }

  paidTransactions(date: Date) {
    return this.transactions.map((transaction) => {
      if (transaction.date.getTime() <= date.getTime()) transaction.paid();
      return transaction;
    });
  }
}
