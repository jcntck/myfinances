import Transaction, { TransactionStatus } from "@/core/domain/entities/Transaction";
import TransactionRepository from "@/core/application/repository/TransactionRepository";
import DatabaseConnection from "@/core/infra/database/DatabaseConnection";
import Installment from "@/core/domain/entities/Installment";

export class TransactionRepositoryDatabase implements TransactionRepository {
  constructor(private readonly connection: DatabaseConnection) {}
  deleteInstallmentIfExists(transaction: Transaction): Promise<void> {
    throw new Error("Method not implemented.");
  }
  deleteRecurrencyIfExists(transaction: Transaction): Promise<void> {
    throw new Error("Method not implemented.");
  }

  updateRecurrencyIfExists(description: string, transaction: Transaction): Promise<void> {
    throw new Error("Method not implemented.");
  }

  updateInstallmentIfExists(transaction: Transaction): Promise<void> {
    throw new Error("Method not implemented.");
  }

  createInstallment(installment: Installment): Promise<string> {
    throw new Error("Method not implemented.");
  }
  installmentExists(description: string, totalValue: number): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  recurrencyExists(description: string, value: number): Promise<boolean> {
    throw new Error("Method not implemented.");
  }

  async create(transaction: Transaction): Promise<void> {
    await this.connection.query(
      "insert into myfinances.transactions (id, date, description, value, status, type, category_id) values ($1, $2, $3, $4, $5, $6, $7)",
      [
        transaction.id,
        transaction.date,
        transaction.description,
        transaction.value,
        transaction.status,
        transaction.type,
        transaction.categoryId,
      ]
    );
  }

  async update(transaction: Transaction): Promise<void> {
    await this.connection.query(
      "update myfinances.transactions set description = $1, category_id = $2, status = $3 where id = $4",
      [transaction.description, transaction.categoryId, transaction.status, transaction.id]
    );
  }

  async delete(id: string): Promise<void> {
    await this.connection.query("delete from myfinances.transactions where id = $1", [id]);
  }

  async findById(id: string): Promise<Transaction | undefined> {
    const [transactionData] = await this.connection.query("select * from myfinances.transactions where id = $1", [id]);
    if (!transactionData) return undefined;
    return new Transaction(
      transactionData.id,
      transactionData.date,
      transactionData.description,
      parseFloat(transactionData.value),
      transactionData.category_id,
      transactionData.status,
      transactionData.type
    );
  }

  async findByTransactionsWithStatus(transactions: Transaction[], status: TransactionStatus): Promise<Transaction[]> {
    const statements = transactions.map((transaction) =>
      this.connection.buildStatement(
        "select * from myfinances.transactions where date = $1 and description = $2 and value = $3 and status = $4",
        [transaction.date, transaction.description, transaction.value, status]
      )
    );
    const result = await this.connection.transaction(statements, "get-id-transactions");
    return result
      .filter(([transaction]: any) => transaction)
      .map(
        ([transactionData]: any) =>
          new Transaction(
            transactionData.id,
            transactionData.date,
            transactionData.description,
            parseFloat(transactionData.value),
            transactionData.category_id,
            transactionData.status,
            transactionData.type
          )
      );
  }

  async createAll(transactions: Transaction[]): Promise<string[]> {
    const statements = transactions.map((transaction) =>
      this.connection.buildStatement(
        "insert into myfinances.transactions (id, date, description, value, status, type, category_id) values ($1, $2, $3, $4, $5, $6, $7) returning id",
        [
          transaction.id,
          transaction.date,
          transaction.description,
          transaction.value,
          transaction.status,
          transaction.type,
          transaction.categoryId,
        ]
      )
    );
    const result = await this.connection.transaction(statements, "create-transactions");
    return result.map(([transaction]: any) => transaction.id);
  }

  async updateAll(transactions: Transaction[]): Promise<void> {
    const statements = transactions.map((transaction) =>
      this.connection.buildStatement(
        "update myfinances.transactions set description = $1, category_id = $2, status = $3 where id = $4",
        [transaction.description, transaction.categoryId, transaction.status, transaction.id]
      )
    );
    await this.connection.transaction(statements, "update-transactions");
  }

  findInstallmentById(id: string): Promise<Installment | undefined> {
    throw new Error("Method not implemented.");
  }

  findAllRecurringTransactions(description: string): Promise<Transaction[]> {
    throw new Error("Method not implemented.");
  }
}
