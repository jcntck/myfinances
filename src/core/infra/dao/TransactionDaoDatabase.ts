import CategoryDAO, { CategoryDTO } from "@/core/domain/dao/CategoryDao";
import TransactionDAO, { TransactionDTO } from "@/core/domain/dao/TransactionDao";
import { TransactionType } from "@/core/domain/entities/Transaction";
import Pageable from "@/core/domain/util/Pageable";
import DatabaseConnection from "@/core/infra/database/DatabaseConnection";
import PageUtil from "@/core/infra/util/PageUtil";
import * as DateFns from "date-fns";

export default class TransactionDAODatabase implements TransactionDAO {
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
      "SELECT t.*, c.name as category_name FROM myfinances.transactions AS t JOIN myfinances.categories AS c ON t.category_id = c.id WHERE $1::daterange @> date::date and type = $2",
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
    }));
  }
}
