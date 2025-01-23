import CategoryRepository from "@/core/application/repository/CategoryRepository";
import TransactionRepository from "@/core/application/repository/TransactionRepository";
import { CreateCreditTransactionInput } from "@/core/application/usecase/credit-transactions/CreateCreditTransaction";
import UseCase from "@/core/application/usecase/UseCase";
import CreditTransaction from "@/core/domain/entities/CreditTransaction";
import Installment from "@/core/domain/entities/Installment";
import { TransactionStatus } from "@/core/domain/entities/Transaction";
import { promise } from "zod";

export default class ImportCreditTransactions implements UseCase<ImportCreditTransactionsInput, void> {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly categoryRepository: CategoryRepository
  ) {}

  private async createInstallments(transactions: CreateCreditTransactionInput[]): Promise<Promise<any>[] | undefined> {
    if (!transactions.length) return;

    return transactions.map(async (input) => {
      const installmentExist = await this.transactionRepository.installmentExists(
        input.description,
        input.value * input.numberOfInstallments!
      );
      if (installmentExist) return;

      const installment = Installment.create(
        input.date,
        input.description,
        input.value,
        input.categoryId,
        input.numberOfInstallments!
      );
      installment.paidTransactions(input.date);
      return this.transactionRepository.createInstallment(installment);
    });
  }

  private async createRecurrency(transactions: CreateCreditTransactionInput[]): Promise<Promise<any>[] | undefined> {
    if (!transactions.length) return;
    let promises: Promise<any>[] = [];

    for await (const input of transactions) {
      const recurrencyExist = await this.transactionRepository.recurrencyExists(input.description, input.value);
      if (recurrencyExist) continue;

      const transaction = CreditTransaction.create(
        input.date,
        input.description,
        input.value,
        input.categoryId,
        input.isRecurring
      );
      transaction.paid();
      const nextTransactions = transaction.createNextRecurringTransactions();
      promises.push(this.transactionRepository.createAll(nextTransactions));
      promises.push(this.transactionRepository.create(transaction));
    }

    return promises;
  }

  async execute(input: ImportCreditTransactionsInput): Promise<void> {
    const categoriesIds = input.map((transaction) => transaction.categoryId);
    const categoryExists = await this.categoryRepository.existsAll(categoriesIds);
    if (!categoryExists) throw new Error("[ImportCreditTransactions] Category not found");

    let promises: Promise<any>[] = [];

    const installmentTransactions = input.filter((transaction) => transaction.numberOfInstallments);
    const recurringTransactions = input.filter((transaction) => transaction.isRecurring);

    const installmentPromises = await this.createInstallments(installmentTransactions);
    if (!!installmentPromises) {
      promises = [...promises, ...installmentPromises];
    }

    const recurringPromises = await this.createRecurrency(recurringTransactions);
    if (!!recurringPromises) {
      promises = [...promises, ...recurringPromises];
    }

    const transactions = input.filter(
      (transaction) => !recurringPromises?.length || (recurringPromises?.length && !transaction.isRecurring)
    );

    let allTransactions = transactions.map((input) => {
      const transaction = CreditTransaction.create(
        input.date,
        input.description,
        input.value,
        input.categoryId,
        input.isRecurring
      );
      return transaction;
    });

    const pendingTransactions = await this.transactionRepository.findByTransactionsWithStatus(
      allTransactions,
      TransactionStatus.PENDING
    );
    if (!!pendingTransactions.length) {
      pendingTransactions.forEach((transaction) => transaction.paid());
      promises.push(this.transactionRepository.updateAll(pendingTransactions));
    }

    const existsTransactions = await this.transactionRepository.findByTransactionsWithStatus(
      allTransactions,
      TransactionStatus.PAID
    );

    allTransactions = allTransactions.filter(
      (transaction) => !existsTransactions.some((existTransaction) => existTransaction.isSame(transaction))
    );

    allTransactions.forEach((transaction) => {
      transaction.paid();
    });
    promises.push(this.transactionRepository.createAll(allTransactions));

    await Promise.all(promises);
  }
}

export type ImportCreditTransactionsInput = CreateCreditTransactionInput[];
