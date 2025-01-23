import Installment from "@/core/domain/entities/Installment";
import Transaction, { TransactionStatus } from "@/core/domain/entities/Transaction";

export default interface TransactionRepository {
  create(transaction: Transaction): Promise<void>;
  update(transaction: Transaction): Promise<void>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<Transaction | undefined>;
  findByTransactionsWithStatus(transactions: Transaction[], status: TransactionStatus): Promise<Transaction[]>;
  findInstallmentById(id: string): Promise<Installment | undefined>;
  findAllRecurringTransactions(description: string): Promise<Transaction[]>;
  createAll(transactions: Transaction[]): Promise<string[]>;
  updateAll(transactions: Transaction[]): Promise<void>;
  createInstallment(installment: Installment): Promise<string>;
  installmentExists(description: string, totalValue: number): Promise<boolean>;
  recurrencyExists(description: string, value: number): Promise<boolean>;
}
