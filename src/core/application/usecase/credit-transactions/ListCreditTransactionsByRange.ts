import UseCase from "@/core/application/usecase/UseCase";
import TransactionDAO, { TransactionDTO } from "@/core/domain/dao/TransactionDao";
import { TransactionType } from "@/core/domain/entities/Transaction";

export default class ListCreditTransactionsByRange
  implements UseCase<ListCreditTransactionsByRangeInput, TransactionDTO[]>
{
  constructor(private readonly transactionDAO: TransactionDAO) {}

  async execute(params: ListCreditTransactionsByRangeInput): Promise<TransactionDTO[]> {
    return this.transactionDAO.listByRange({ ...params, type: TransactionType.CREDIT });
  }
}

export type ListCreditTransactionsByRangeInput = {
  startDate: Date;
  endDate: Date;
};
