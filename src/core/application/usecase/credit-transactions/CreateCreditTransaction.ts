import CategoryRepository from "@/core/application/repository/CategoryRepository";
import TransactionRepository from "@/core/application/repository/TransactionRepository";
import UseCase from "@/core/application/usecase/UseCase";
import CreditTransaction from "@/core/domain/entities/CreditTransaction";
import Installment from "@/core/domain/entities/Installment";

export default class CreateCreditTransaction
  implements UseCase<CreateCreditTransactionInput, CreateCreditTransactionOutput>
{
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly categoryRepository: CategoryRepository
  ) {}

  async execute(input: CreateCreditTransactionInput): Promise<CreateCreditTransactionOutput> {
    const categoryExists = await this.categoryRepository.findById(input.categoryId);
    if (!categoryExists) throw new Error("[CreateCreditTransaction] Category not found");

    if (input.numberOfInstallments) {
      const installment = Installment.create(
        input.date,
        input.description,
        input.value,
        input.categoryId,
        input.numberOfInstallments
      );

      await this.transactionRepository.createInstallment(installment);

      return {
        installmentId: installment.id,
      };
    }

    const transaction = CreditTransaction.create(
      input.date,
      input.description,
      input.value,
      input.categoryId,
      input.isRecurring
    );

    if (transaction.isRecurring) {
      const nextTransactions = transaction.createNextRecurringTransactions();
      await this.transactionRepository.createAll(nextTransactions);
    }

    await this.transactionRepository.create(transaction);

    return {
      transactionId: transaction.id,
    };
  }
}

export type CreateCreditTransactionInput = {
  date: Date;
  description: string;
  value: number;
  categoryId: string;
  numberOfInstallments?: number;
  isRecurring?: boolean;
};

export type CreateCreditTransactionOutput = {
  transactionId?: string;
  installmentId?: string;
};
