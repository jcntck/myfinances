import Transaction, { TransactionStatus } from "@/core/domain/entities/Transaction";

export default interface TransactionRepository {
  create(transaction: Transaction): Promise<void>;
  update(transaction: Transaction): Promise<void>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<Transaction | undefined>;
  findByTransactionsWithStatus(transactions: Transaction[], status: TransactionStatus): Promise<Transaction[]>;
  updateAll(transactions: Transaction[]): Promise<void>;
  createAll(transactions: Transaction[]): Promise<string[]>;
}
