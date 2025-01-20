import UseCase from "@/core/application/usecase/UseCase";
import TransactionRepository from "@/core/application/repository/TransactionRepository";

export default class DeleteCreditTransaction implements UseCase<string, void> {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async execute(transactionId: string): Promise<void> {
    const transaction = await this.transactionRepository.findById(transactionId);
    if (!transaction) throw new Error("[DeleteCreditTransaction] Credit transaction not found");
    await this.transactionRepository.delete(transactionId);
  }
}
