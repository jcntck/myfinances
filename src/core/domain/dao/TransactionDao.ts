import { TransactionType } from "@/core/domain/entities/Transaction";

export type TransactionDTO = {
  id: string;
  date: Date;
  description: string;
  value: number;
  type: string;
  status: string;
  categoryId: string;
  categoryName: string;
};

export default interface TransactionDAO {
  listByRange({
    startDate,
    endDate,
    type,
  }: {
    startDate: Date;
    endDate: Date;
    type: TransactionType;
  }): Promise<TransactionDTO[]>;
}
