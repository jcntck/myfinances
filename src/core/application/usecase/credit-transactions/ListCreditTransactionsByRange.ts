import UseCase from "@/core/application/usecase/UseCase";
import TransactionDAO, { CreditTransactionDTO, TransactionDTO } from "@/core/domain/dao/TransactionDao";
import { TransactionType } from "@/core/domain/entities/Transaction";

export default class ListCreditTransactionsByRange
  implements UseCase<ListCreditTransactionsByRangeInput, CreditTransactionDTO[]>
{
  constructor(private readonly transactionDAO: TransactionDAO) {}

  async execute(params: ListCreditTransactionsByRangeInput): Promise<CreditTransactionDTO[]> {
    return this.transactionDAO.listByRange({ ...params, type: TransactionType.CREDIT }) as Promise<
      CreditTransactionDTO[]
    >;
  }
}

export type ListCreditTransactionsByRangeInput = {
  startDate: Date;
  endDate: Date;
};
