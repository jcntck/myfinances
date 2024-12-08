import Transaction from "@/domain/entities/Transaction";

export default interface TransactionRepository {
  create(transaction: Transaction): Promise<void>;
  update(transaction: Transaction): Promise<void>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<Transaction | undefined>;
}
