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

    const result = await this.db.query(
      `SELECT 
        t.*, 
        c.name AS category_name,
        ti.installment_number::integer, 
        (SELECT COUNT(*)::integer FROM myfinances.transaction_installment AS tmp WHERE tmp.installment_id = ti.installment_id) AS max_installment, 
        i.total_value 
      FROM myfinances.transactions AS t 
      JOIN myfinances.categories AS c ON c.id = t.category_id
      LEFT JOIN myfinances.transaction_installment AS ti ON ti.transaction_id = t.id 
      LEFT JOIN myfinances.installments AS i ON i.id = ti.installment_id 
      WHERE $1::daterange @> date::date and type = $2
      order by date asc;`,
      [`[${startDateString}, ${endDateString}]`, type]
    );

    return result.map((transaction: any) => ({
      id: transaction.id,
      date: new Date(transaction.date),
      description: transaction.description,
      value: parseFloat(transaction.value),
      type: transaction.type,
      status: transaction.status,
      categoryId: transaction.category_id,
      categoryName: transaction.category_name,
      isRecurring: transaction.is_recurring,
      installmentNumber: transaction.installment_number ?? null,
      maxInstallments: transaction.max_installment ?? null,
    }));
  }
}
