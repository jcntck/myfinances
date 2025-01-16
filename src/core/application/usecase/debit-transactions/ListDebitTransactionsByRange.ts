import UseCase from "@/core/application/usecase/UseCase";
import TransactionDAO, { TransactionDTO } from "@/core/domain/dao/TransactionDao";
import { TransactionType } from "@/core/domain/entities/Transaction";

export default class ListDebitTransactionsByRange
  implements UseCase<ListDebitTransactionsByRangeInput, TransactionDTO[]>
{
  constructor(private readonly transactionDAO: TransactionDAO) {}

  async execute(params: ListDebitTransactionsByRangeInput): Promise<TransactionDTO[]> {
    return this.transactionDAO.listByRange({ ...params, type: TransactionType.DEBIT });
  }
}

export type ListDebitTransactionsByRangeInput = {
  startDate: Date;
  endDate: Date;
};
