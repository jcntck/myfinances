import DebitTransaction from "@/domain/entities/DebitTransaction";

export default interface DebitTransactionRepository {
  create(debitTransaction: DebitTransaction): Promise<void>;
  update(debitTransaction: DebitTransaction): Promise<void>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<DebitTransaction | undefined>;
}
