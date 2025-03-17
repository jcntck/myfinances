'use server';

import Application from '@/Application';
import { TransactionFormEdit } from '@/components/credit-transactions/form/edit';
import { getAllPaginatedRecords } from '@/lib/get-all-paginated-records';

export default async function CreditTransactionEditPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: { backToUrl?: string };
}) {
  const { id } = await params;
  const { ListCategories } = Application.Instance.Category;
  const { GetCreditTransaction } = Application.Instance.CreditTransaction;
  const categories = await getAllPaginatedRecords(ListCategories, 1000);
  const transaction = await GetCreditTransaction.execute(id);
  return (
    <div className="container mx-auto py-4 flex flex-col gap-2">
      <div className="flex items-center justify-between border-b pb-2">
        <h1 className="scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0">
          Editar registro - Transações de crédito
        </h1>
      </div>
      <section>
        <TransactionFormEdit
          categories={categories}
          transaction={transaction}
          backTo={searchParams.backToUrl}
        />
      </section>
    </div>
  );
}

