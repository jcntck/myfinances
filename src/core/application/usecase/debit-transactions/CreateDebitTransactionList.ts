import { CreateDebitTransactionInput } from "@/core/application/usecase/debit-transactions/CreateDebitTransaction";
import UseCase from "@/core/application/usecase/UseCase";
import DebitTransaction from "@/core/domain/entities/DebitTransaction";
import CategoryRepository from "@/core/domain/repository/CategoryRepository";
import DebitTransactionRepository from "@/core/domain/repository/TransactionRepository";

export default class CreateDebitTransactionList implements UseCase<CreateDebitTransactionListInput, string[]> {
  constructor(
    private readonly debitTransactionRepository: DebitTransactionRepository,
    private readonly categoryRepository: CategoryRepository
  ) {}

  async execute(input: CreateDebitTransactionListInput): Promise<string[]> {
    const categoriesIds = input.map((transaction) => transaction.categoryId);
    const categoryExists = await this.categoryRepository.existsAll(categoriesIds);
    if (!categoryExists) throw new Error("[CreateDebitTransactionList] Category not found");

    let debitTransactionList = input.map((input) => {
      const debitTransaction = DebitTransaction.create(input.date, input.description, input.value, input.categoryId);
      debitTransaction.paid();
      return debitTransaction;
    });

    const existsTransactions = await this.debitTransactionRepository.findByTransactions(debitTransactionList);
    debitTransactionList = debitTransactionList.filter(
      (transaction) => !existsTransactions.some((existTransaction) => existTransaction.isSame(transaction))
    );

    return this.debitTransactionRepository.createAll(debitTransactionList);
  }
}

export type CreateDebitTransactionListInput = CreateDebitTransactionInput[];
