import TransactionDAO, { TransactionDTO } from "@/core/domain/dao/TransactionDao";
import { TransactionType } from "@/core/domain/entities/Transaction";
import DatabaseConnection from "@/core/infra/database/DatabaseConnection";
import * as DateFns from "date-fns";

export default class CreditTransactionDAODatabase implements TransactionDAO {
  constructor(private readonly db: DatabaseConnection) {}

  async listByRange({
    startDate,
    endDate,
    type,
  }: {
    startDate: Date;
    endDate: Date;
    type: TransactionType;
  }): Promise<TransactionDTO[]> {
    const startDateString = DateFns.format(startDate, "yyyy-MM-dd");
    const endDateString = DateFns.format(endDate, "yyyy-MM-dd");

    let transactions = await this.db.query(
      "SELECT t.*, c.name as category_name FROM myfinances.transactions AS t JOIN myfinances.categories AS c ON t.category_id = c.id WHERE $1::daterange @> date::date and type = $2",
      [`[${startDateString}, ${endDateString}]`, type]
    );
    let installments = await this.db.query(
      `SELECT t.id, 
        i.due_date AS date, 
        t.description, 
        i.value, 
        t."type", 
        t."status", 
        t.category_id, 
        c.name as category_name,
        i.installment_number::integer,
        (SELECT COUNT(*)::integer FROM myfinances.installments WHERE transaction_id = t.id) AS max_installments
      FROM myfinances.installments AS i 
      JOIN myfinances.transactions AS t ON i.transaction_id = t.id
      JOIN myfinances.categories AS c ON t.category_id = c.id
      WHERE $1::daterange @> due_date::date`,
      [`[${startDateString}, ${endDateString}]`]
    );

    const result = [...transactions, ...installments];

    return result.map((transaction: any) => ({
      id: transaction.id,
      date: new Date(transaction.date),
      description: transaction.description,
      value: parseFloat(transaction.value),
      type: transaction.type,
      status: transaction.status,
      categoryId: transaction.category_id,
      categoryName: transaction.category_name,
      installmentNumber: transaction.installment_number ?? null,
      maxInstallments: transaction.max_installments ?? null,
    }));
  }
}
