import Category from "@/domain/entities/Category";
import DebitTransaction from "@/domain/entities/DebitTransaction";
import DebitTransactionRepository from "@/domain/repository/DebitTransactionRepository";
import DatabaseConnection from "@/infra/database/DatabaseConnection";

export class DebitTransactionDatabase implements DebitTransactionRepository {
  constructor(private readonly connection: DatabaseConnection) {}

  async create(debitTransaction: DebitTransaction): Promise<void> {
    await this.connection.query(
      "insert into myfinances.transactions (id, date, description, value, category_id) values ($1, $2, $3, $4, $5)",
      [
        debitTransaction.id,
        debitTransaction.date,
        debitTransaction.description,
        debitTransaction.value,
        debitTransaction.categoryId,
      ]
    );
  }

  async update(debitTransaction: DebitTransaction): Promise<void> {
    await this.connection.query("update myfinances.transactions set description = $1, category_id = $2 where id = $3", [
      debitTransaction.description,
      debitTransaction.categoryId,
      debitTransaction.id,
    ]);
  }

  async delete(id: string): Promise<void> {
    await this.connection.query("delete from myfinances.transactions where id = $1", [id]);
  }

  async findById(id: string): Promise<DebitTransaction | undefined> {
    const [debitTransactionData] = await this.connection.query("select * from myfinances.transactions where id = $1", [
      id,
    ]);
    if (!debitTransactionData) return undefined;
    return new DebitTransaction(
      debitTransactionData.id,
      debitTransactionData.date,
      debitTransactionData.description,
      parseFloat(debitTransactionData.value),
      debitTransactionData.category_id
    );
  }
}
