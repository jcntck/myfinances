import UseCase from "@/core/application/usecase/UseCase";
import { TransactionStatus, TransactionType } from "@/core/domain/entities/Transaction";
import DebitTransactionRepository from "@/core/application/repository/TransactionRepository";

export default class GetDebitTransaction implements UseCase<string, GetDebitTransactionOutput> {
  constructor(private readonly debitTransactionRepository: DebitTransactionRepository) {}

  async execute(input: string): Promise<GetDebitTransactionOutput> {
    const debitTransaction = await this.debitTransactionRepository.findById(input);
    if (!debitTransaction) throw new Error("[GetDebitTransaction] Debit transaction not found");
    return {
      id: debitTransaction.id,
      date: debitTransaction.date,
      description: debitTransaction.description,
      value: debitTransaction.value,
      categoryId: debitTransaction.categoryId,
      status: debitTransaction.status,
      type: debitTransaction.type,
    };
  }
}

export type GetDebitTransactionOutput = {
  id: string;
  date: Date;
  description: string;
  value: number;
  categoryId: string;
  status: TransactionStatus;
  type: TransactionType;
};
