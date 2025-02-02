import { DebitTransaction } from "@/app/types/entities";
import Application from "@/Application";
import { DatePickerWithRange } from "@/components/shared/date-picker-with-range";
import { TransactionsDataTable } from "@/components/debit-transactions/data-table";
import { dataTableColumns } from "@/components/debit-transactions/data-table/columns";
import { TransactionDTO } from "@/core/domain/dao/TransactionDao";
import { getAllPaginatedRecords } from "@/lib/get-all-paginated-records";
import { parseStringToDate } from "@/lib/utils";
import { endOfMonth, startOfMonth } from "date-fns";

export default async function DebitTransactionsPage({
  searchParams,
}: {
  searchParams: Promise<{ from: string; to: string }>;
}) {
  const { from, to } = await searchParams;
  const startDate = parseStringToDate(from, startOfMonth);
  const endDate = parseStringToDate(to, endOfMonth);

  const { ListCategories } = Application.Instance.Category;
  const { ListTransactionsByRange } = Application.Instance.DebitTransaction;

  const categories = await getAllPaginatedRecords(ListCategories, 1000);
  const transactions = await ListTransactionsByRange.execute({ startDate, endDate });

  return (
    <div className="container mx-auto py-4 flex flex-col gap-2">
      <div className="flex items-center justify-between border-b pb-2">
        <h1 className="scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0">Transações de débito</h1>
        <DatePickerWithRange />
      </div>
      <TransactionsDataTable
        data={transactions.map(
          (transaction: TransactionDTO) =>
            ({
              id: transaction.id,
              date: new Date(transaction.date).toLocaleDateString("pt-BR"),
              description: transaction.description,
              value: transaction.value,
              category: {
                id: transaction.categoryId,
                name: transaction.categoryName,
              },
              status: transaction.status,
            } as DebitTransaction)
        )}
        columns={dataTableColumns}
        categories={categories}
      />
    </div>
  );
}
