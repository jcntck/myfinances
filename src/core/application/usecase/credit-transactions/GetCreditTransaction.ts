import UseCase from "@/core/application/usecase/UseCase";
import { TransactionStatus, TransactionType } from "@/core/domain/entities/Transaction";
import TransactionRepository from "@/core/application/repository/TransactionRepository";
import CreditTransaction from "@/core/domain/entities/CreditTransaction";

export default class GetCreditTransaction implements UseCase<string, GetCreditTransactionOutput> {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async execute(input: string): Promise<GetCreditTransactionOutput> {
    const transaction = (await this.transactionRepository.findById(input)) as CreditTransaction;
    if (!transaction) throw new Error("[GetCreditTransaction] Credit transaction not found");
    return {
      id: transaction.id,
      date: transaction.date,
      description: transaction.description,
      value: transaction.value,
      categoryId: transaction.categoryId,
      status: transaction.status,
      type: transaction.type,
    };
  }
}

type GetCreditTransactionOutput = {
  id: string;
  date: Date;
  description: string;
  value: number;
  categoryId: string;
  status: TransactionStatus;
  type: TransactionType;
};
