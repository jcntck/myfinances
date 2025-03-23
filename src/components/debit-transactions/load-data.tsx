'use client';

import { ApiDebitTransaction } from '@/app/types/api';
import { Category, DebitTransaction } from '@/app/types/entities';
import { dataTableColumns } from '@/components/debit-transactions/data-table/columns';
import { usePeriod } from '@/contexts/period';
import { useFetch } from '@/hooks/use-fetch';
import { useEffect, useState } from 'react';
import { TransactionsDataTable } from './data-table';
import DebitTransactionSkeleton from './fallback/Skeleton';

interface DebitTransactionsLoadDataProps {
  categories: Category[];
}

export function DebitTransactionsLoadData({
  categories,
}: DebitTransactionsLoadDataProps) {
  const { date } = usePeriod();
  const { isLoading, error, fetchData } = useFetch<ApiDebitTransaction[]>();
  const [transactions, setTransactions] = useState<ApiDebitTransaction[]>([]);

  useEffect(() => {
    fetchData(
      `/api/debit-transactions?from=${date.from?.toISOString()}&to=${date.to?.toISOString()}`
    ).then((data) => setTransactions(data!));

    console.log(error);
  }, [date]);

  if (isLoading) {
    return <DebitTransactionSkeleton />;
  }

  return (
    <TransactionsDataTable
      data={transactions.map(
        (transaction: ApiDebitTransaction) =>
          ({
            id: transaction.id,
            date: new Date(transaction.date).toLocaleDateString('pt-BR'),
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
  );
}
