import UseCase from "@/core/application/usecase/UseCase";
import CreditTransaction from "@/core/domain/entities/CreditTransaction";
import CategoryRepository from "@/core/application/repository/CategoryRepository";
import TransactionRepository from "@/core/application/repository/TransactionRepository";

export default class CreateCreditTransaction
  implements UseCase<CreateCreditTransactionInput, CreateCreditTransactionOutput>
{
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly categoryRepository: CategoryRepository
  ) {}

  async execute(input: CreateCreditTransactionInput): Promise<CreateCreditTransactionOutput> {
    const transaction = CreditTransaction.create(
      input.date,
      input.description,
      input.value,
      input.categoryId,
      input.installments
    );
    const categoryExists = await this.categoryRepository.findById(transaction.categoryId);
    if (!categoryExists) throw new Error("[CreateCreditTransaction] Category not found");
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
  installments?: number;
};

export type CreateCreditTransactionOutput = {
  transactionId: string;
};
