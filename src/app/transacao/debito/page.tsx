import Application from '@/Application';
import { DebitTransactionsLoadData } from '@/components/debit-transactions/load-data';
import { getAllPaginatedRecords } from '@/lib/get-all-paginated-records';

export default async function DebitTransactionsPage() {
  const { ListCategories } = Application.Instance.Category;
  const categories = await getAllPaginatedRecords(ListCategories, 1000);

  return (
    <div className="container mx-auto py-4 flex flex-col gap-2">
      <div className="flex items-center justify-between border-b pb-2">
        <h1 className="scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0">
          Transações de débito
        </h1>
      </div>
      <DebitTransactionsLoadData categories={categories} />
    </div>
  );
}

