import UUID from "@/core/domain/vo/UUID";
import Transaction, { TransactionStatus, TransactionType } from "./Transaction";
import Installment from "@/core/domain/entities/Installment";

export default class CreditTransaction extends Transaction {
  private _installments?: Installment[];

  constructor(
    id: string,
    date: Date,
    description: string,
    value: number,
    categoryId: string,
    status: TransactionStatus,
    type: TransactionType,
    installments?: Installment[]
  ) {
    super(id, date, description, value, categoryId, status, type);
    if (installments) {
      this._installments = installments;
    }
  }

  get installments(): Installment[] | undefined {
    return this._installments;
  }

  static create(date: Date, description: string, value: number, categoryId: string, numberOfInstallments?: number) {
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
      installments
    );
  }
}
