import UseCase from "@/core/application/usecase/UseCase";
import DebitTransactionRepository from "@/core/domain/repository/TransactionRepository";

export default class DeleteDebitTransaction implements UseCase<string, void> {
  constructor(private readonly debitTransactionRepository: DebitTransactionRepository) {}

  async execute(transactionId: string): Promise<void> {
    const debitTransaction = await this.debitTransactionRepository.findById(transactionId);
    if (!debitTransaction) throw new Error("[DeleteDebitTransaction] Debit transaction not found");
    await this.debitTransactionRepository.delete(transactionId);
  }
}
