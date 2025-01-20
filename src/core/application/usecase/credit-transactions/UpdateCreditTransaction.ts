import UseCase from "@/core/application/usecase/UseCase";
import CreditTransaction from "@/core/domain/entities/CreditTransaction";
import { TransactionStatus } from "@/core/domain/entities/Transaction";
import CategoryRepository from "@/core/application/repository/CategoryRepository";
import TransactionRepository from "@/core/application/repository/TransactionRepository";

export default class UpdateCreditTransaction implements UseCase<UpdateCreditTransactionInput, void> {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly categoryRepository: CategoryRepository
  ) {}

  async execute(input: UpdateCreditTransactionInput): Promise<void> {
    const transaction = await this.transactionRepository.findById(input.id);
    if (!transaction) throw new Error("[UpdateCreditTransaction] Credit transaction not found");
    const updatedDebitTransaction = new CreditTransaction(
      transaction.id,
      transaction.date,
      input.description ?? transaction.description,
      transaction.value,
      input.categoryId ?? transaction.categoryId,
      (input.status as TransactionStatus) ?? transaction.status,
      transaction.type
    );
    const categoryExists = await this.categoryRepository.findById(updatedDebitTransaction.categoryId);
    if (!categoryExists) throw new Error("[UpdateCreditTransaction] Category not found");
    await this.transactionRepository.update(updatedDebitTransaction);
  }
}

export type UpdateCreditTransactionInput = {
  id: string;
  description?: string;
  categoryId?: string;
  status?: string;
};
