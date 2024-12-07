import UseCase from "@/application/usecase/UseCase";
import DebitTransaction from "@/domain/entities/DebitTransaction";
import { TransactionStatus } from "@/domain/entities/Transaction";
import CategoryRepository from "@/domain/repository/CategoryRepository";
import DebitTransactionRepository from "@/domain/repository/DebitTransactionRepository";

export default class UpdateDebitTransaction implements UseCase<UpdateDebitTransactionInput, void> {
  constructor(
    private readonly debitTransactionRepository: DebitTransactionRepository,
    private readonly categoryRepository: CategoryRepository
  ) {}

  async execute(input: UpdateDebitTransactionInput): Promise<void> {
    const debitTransaction = await this.debitTransactionRepository.findById(input.id);
    if (!debitTransaction) throw new Error("[UpdateDebitTransaction] Debit transaction not found");
    const updatedDebitTransaction = new DebitTransaction(
      debitTransaction.id,
      debitTransaction.date,
      input.description ?? debitTransaction.description,
      debitTransaction.value,
      input.categoryId ?? debitTransaction.categoryId,
      (input.status as TransactionStatus) ?? debitTransaction.status,
      debitTransaction.type
    );
    const categoryExists = await this.categoryRepository.findById(updatedDebitTransaction.categoryId);
    if (!categoryExists) throw new Error("[UpdateDebitTransaction] Category not found");
    await this.debitTransactionRepository.update(updatedDebitTransaction);
  }
}

export type UpdateDebitTransactionInput = {
  id: string;
  description?: string;
  categoryId?: string;
  status?: string;
};
