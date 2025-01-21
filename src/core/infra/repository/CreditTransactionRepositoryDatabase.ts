import Transaction, { TransactionStatus } from "@/core/domain/entities/Transaction";
import TransactionRepository from "@/core/application/repository/TransactionRepository";
import DatabaseConnection from "@/core/infra/database/DatabaseConnection";
import CreditTransaction from "@/core/domain/entities/CreditTransaction";
import Installment from "@/core/domain/entities/Installment";
import { Console } from "console";

export class CreditTransactionRepositoryDatabase implements TransactionRepository {
  constructor(private readonly connection: DatabaseConnection) {}

  async create(transaction: CreditTransaction): Promise<void> {
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

    if (transaction.installments) {
      const values = transaction.installments.map((installment) =>
        this.connection.buildStatement("($1, $2, $3, $4, $5)", [
          installment.id,
          installment.date,
          installment.value,
          installment.installmentNumber,
          transaction.id,
        ])
      );
      await this.connection.query(
        "insert into myfinances.installments (id, due_date, value, installment_number, transaction_id) values " +
          values.join(", ")
      );
    }
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

  async findById(id: string): Promise<CreditTransaction | undefined> {
    const [transactionData] = await this.connection.query("select * from myfinances.transactions where id = $1", [id]);
    if (!transactionData) return undefined;
    const installmentsData = await this.connection.query(
      "select * from myfinances.installments WHERE transaction_id = $1",
      [id]
    );
    let installments: Installment[] = [];
    if (installmentsData.length > 0) {
      installments = installmentsData.map((installment: any) => {
        return new Installment(
          installment.id,
          new Date(installment.due_date),
          parseFloat(installment.value),
          parseInt(installment.installment_number)
        );
      });
    }
    return new CreditTransaction(
      transactionData.id,
      transactionData.date,
      transactionData.description,
      parseFloat(transactionData.value),
      transactionData.category_id,
      transactionData.status,
      transactionData.type,
      installments.length > 0 ? installments : undefined
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

  async findAllRecurringTransactions(description: string): Promise<CreditTransaction[]> {
    const result = await this.connection.query(
      "select * from myfinances.transactions where description = $1 and type = 'credit' and is_recurring = true",
      [description]
    );
    return result.map(
      (transaction: any) =>
        new CreditTransaction(
          transaction.id,
          new Date(transaction.date),
          transaction.description,
          parseFloat(transaction.value),
          transaction.category_id,
          transaction.status,
          transaction.type,
          undefined,
          true
        )
    );
  }

  async createAll(transactions: CreditTransaction[]): Promise<string[]> {
    const statements = transactions.map((transaction) =>
      this.connection.buildStatement(
        "insert into myfinances.transactions (id, date, description, value, status, type, category_id, is_recurring) values ($1, $2, $3, $4, $5, $6, $7, $8) returning id",
        [
          transaction.id,
          transaction.date,
          transaction.description,
          transaction.value,
          transaction.status,
          transaction.type,
          transaction.categoryId,
          transaction.isRecurring,
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
}
