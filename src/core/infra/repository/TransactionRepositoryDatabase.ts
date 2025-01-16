import Transaction from "@/core/domain/entities/Transaction";
import TransactionRepository from "@/core/domain/repository/TransactionRepository";
import DatabaseConnection from "@/core/infra/database/DatabaseConnection";

export class TransactionRepositoryDatabase implements TransactionRepository {
  constructor(private readonly connection: DatabaseConnection) {}

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
}
