import UUID from "@/core/domain/vo/UUID";
import Transaction, { TransactionStatus, TransactionType } from "./Transaction";
import Installment from "@/core/domain/entities/Installment";
import { addMonths } from "date-fns";

export default class CreditTransaction extends Transaction {
  private RECURRING_MONTHS = 12;
  private _installments?: Installment[];

  constructor(
    id: string,
    date: Date,
    description: string,
    value: number,
    categoryId: string,
    status: TransactionStatus,
    type: TransactionType,
    installments?: Installment[],
    readonly isRecurring: boolean = false
  ) {
    super(id, date, description, value, categoryId, status, type);
    if (installments) {
      this._installments = installments;
    }
    if (installments && this.isRecurring)
      throw new Error(
        "[CreditTransaction] Cannot create a recurring transaction and installment transaction at the same time"
      );
  }

  get installments(): Installment[] | undefined {
    return this._installments;
  }

  static create(
    date: Date,
    description: string,
    value: number,
    categoryId: string,
    numberOfInstallments?: number,
    isRecurring?: boolean
  ) {
    const id = UUID.create().getValue();
    const installments = numberOfInstallments ? Installment.create(date, value, numberOfInstallments) : undefined;
    const calculatedValue = installments ? installments.length * value : value;
    return new CreditTransaction(
      id,
      date,
      description,
      calculatedValue,
      categoryId,
      TransactionStatus.PENDING,
      TransactionType.CREDIT,
      installments,
      isRecurring
    );
  }

  createNextRecurringTransactions(): CreditTransaction[] {
    if (!this.isRecurring) throw new Error("[CreditTransaction] Transaction is not recurring");

    const transactions = [];
    for (let index = 1; index <= this.RECURRING_MONTHS; index++) {
      const newTransaction = CreditTransaction.create(
        addMonths(new Date(), index),
        this.description,
        this.value,
        this.categoryId,
        undefined,
        true
      );
      transactions.push(newTransaction);
    }

    return transactions;
  }
}
