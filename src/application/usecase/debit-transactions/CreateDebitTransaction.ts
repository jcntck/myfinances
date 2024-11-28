import UseCase from "@/application/usecase/UseCase";
import DebitTransaction from "@/domain/entities/DebitTransaction";
import CategoryRepository from "@/domain/repository/CategoryRepository";
import DebitTransactionRepository from "@/domain/repository/DebitTransactionRepository";

export default class CreateDebitTransaction
  implements UseCase<CreateDebitTransactionInput, CreateDebitTransactionOutput>
{
  constructor(
    private readonly debitTransactionRepository: DebitTransactionRepository,
    private readonly categoryRepository: CategoryRepository
  ) {}

  async execute(input: CreateDebitTransactionInput): Promise<CreateDebitTransactionOutput> {
    const debitTransaction = DebitTransaction.create(input.date, input.description, input.value, input.categoryId);
    const categoryExists = await this.categoryRepository.findById(debitTransaction.categoryId);
    if (!categoryExists) throw new Error("[CreateDebitTransaction] Category not found");
    await this.debitTransactionRepository.create(debitTransaction);
    return {
      transactionId: debitTransaction.id,
    };
  }
}

export type CreateDebitTransactionInput = {
  date: Date;
  description: string;
  value: number;
  categoryId: string;
};

export type CreateDebitTransactionOutput = {
  transactionId: string;
};
