import TransactionRepository from "@/core/application/repository/TransactionRepository";
import CreditTransaction from "@/core/domain/entities/CreditTransaction";
import Installment from "@/core/domain/entities/Installment";
import Transaction, { TransactionStatus } from "@/core/domain/entities/Transaction";
import DatabaseConnection from "@/core/infra/database/DatabaseConnection";

export class CreditTransactionRepositoryDatabase implements TransactionRepository {
  constructor(private readonly connection: DatabaseConnection) {}

  async create(transaction: CreditTransaction): Promise<void> {
    await this.connection.query(
      "insert into myfinances.transactions (id, date, description, value, status, type, category_id, is_recurring) values ($1, $2, $3, $4, $5, $6, $7, $8)",
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

  async findById(id: string): Promise<CreditTransaction | undefined> {
    const [transactionData] = await this.connection.query("SELECT * from myfinances.transactions WHERE id = $1", [id]);
    if (!transactionData) return undefined;
    return new CreditTransaction(
      transactionData.id,
      transactionData.date,
      transactionData.description,
      parseFloat(transactionData.value),
      transactionData.category_id,
      transactionData.status,
      transactionData.type,
      transactionData.is_recurring
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

  async findInstallmentById(id: string): Promise<Installment | undefined> {
    const result = await this.connection.query(
      "SELECT ti.installment_id, ti.transaction_id, i.total_value, ti.installment_number, t.date, t.description, t.value, t.status, t.type, t.is_recurring, t.category_id FROM myfinances.installments AS i JOIN myfinances.transaction_installment AS ti ON i.id = ti.installment_id JOIN myfinances.transactions AS t ON t.id = ti.transaction_id WHERE i.id = $1;",
      [id]
    );
    if (!result) return undefined;
    const [installment] = result;
    const transactions = result.map(
      (transaction: any) =>
        new CreditTransaction(
          transaction.transaction_id,
          new Date(transaction.date),
          transaction.description,
          parseFloat(transaction.value),
          transaction.category_id,
          transaction.status,
          transaction.type
        )
    );
    return new Installment(
      installment.installment_id,
      parseFloat(installment.total_value),
      installment.description,
      transactions
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

  async createInstallment(installment: Installment): Promise<string> {
    let statements = [];

    statements.push(
      this.connection.buildStatement(
        "insert into myfinances.installments (id, total_value, description) values ($1, $2, $3) returning id as installment_id",
        [installment.id, installment.totalValue, installment.description]
      )
    );

    installment.transactions.forEach((transaction, index) => {
      const statementTransaction = this.connection.buildStatement(
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
      );

      const statementTransactionInstallment = this.connection.buildStatement(
        "insert into myfinances.transaction_installment (transaction_id, installment_id, installment_number) values ($1, $2, $3)",
        [transaction.id, installment.id, index + 1]
      );
      statements.push(statementTransaction, statementTransactionInstallment);
    });

    const [result] = await this.connection.transaction(statements, "create-installment");
    return result[0].installment_id;
  }

  async installmentExists(description: string, totalValue: number): Promise<boolean> {
    const [result] = await this.connection.query(
      "select count(*)::integer from myfinances.installments where description = $1 and total_value = $2",
      [description, totalValue]
    );

    return result.count > 0;
  }

  async recurrencyExists(description: string, value: number): Promise<boolean> {
    const [result] = await this.connection.query(
      "select count(*)::integer from myfinances.transactions where description = $1 and value = $2 and type = 'credit' and is_recurring = true",
      [description, value]
    );

    return result.count > 0;
  }
}
