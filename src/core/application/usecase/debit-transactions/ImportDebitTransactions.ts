import { CreateDebitTransactionInput } from "@/core/application/usecase/debit-transactions/CreateDebitTransaction";
import UseCase from "@/core/application/usecase/UseCase";
import DebitTransaction from "@/core/domain/entities/DebitTransaction";
import { TransactionStatus } from "@/core/domain/entities/Transaction";
import CategoryRepository from "@/core/application/repository/CategoryRepository";
import DebitTransactionRepository from "@/core/application/repository/TransactionRepository";

export default class ImportDebitTransactions implements UseCase<ImportDebitTransactionsInput, string[]> {
  constructor(
    private readonly debitTransactionRepository: DebitTransactionRepository,
    private readonly categoryRepository: CategoryRepository
  ) {}

  async execute(input: ImportDebitTransactionsInput): Promise<string[]> {
    const categoriesIds = input.map((transaction) => transaction.categoryId);
    const categoryExists = await this.categoryRepository.existsAll(categoriesIds);
    if (!categoryExists) throw new Error("[ImportDebitTransactions] Category not found");

    let debitTransactionList = input.map((input) => {
      const debitTransaction = DebitTransaction.create(input.date, input.description, input.value, input.categoryId);
      debitTransaction.paid();
      return debitTransaction;
    });

    const pendingTransactions = await this.debitTransactionRepository.findByTransactionsWithStatus(
      debitTransactionList,
      TransactionStatus.PENDING
    );
    if (!!pendingTransactions.length) {
      pendingTransactions.forEach((transaction) => transaction.paid());
      await this.debitTransactionRepository.updateAll(pendingTransactions);
    }

    const existsTransactions = await this.debitTransactionRepository.findByTransactionsWithStatus(
      debitTransactionList,
      TransactionStatus.PAID
    );
    debitTransactionList = debitTransactionList.filter(
      (transaction) => !existsTransactions.some((existTransaction) => existTransaction.isSame(transaction))
    );

    return this.debitTransactionRepository.createAll(debitTransactionList);
  }
}

export type ImportDebitTransactionsInput = CreateDebitTransactionInput[];
