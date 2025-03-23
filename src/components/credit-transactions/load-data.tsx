'use client';

import { ApiCreditTransaction } from '@/app/types/api';
import { Category, CreditTransaction } from '@/app/types/entities';
import { dataTableColumns } from '@/components/credit-transactions/data-table/columns';
import { usePeriod } from '@/contexts/period';
import { useFetch } from '@/hooks/use-fetch';
import { useEffect, useState } from 'react';
import { TransactionsDataTable } from './data-table';
import CreditTransactionSkeleton from './fallback/Skeleton';

interface CreditTransactionsLoadDataProps {
  categories: Category[];
}

export function CreditTransactionsLoadData({
  categories,
}: CreditTransactionsLoadDataProps) {
  const { date } = usePeriod();
  const { isLoading, error, fetchData } = useFetch<ApiCreditTransaction[]>();
  const [transactions, setTransactions] = useState<ApiCreditTransaction[]>([]);

  useEffect(() => {
    fetchData(
      `/api/credit-transactions?from=${date.from?.toISOString()}&to=${date.to?.toISOString()}`
    ).then((data) => setTransactions(data!));
  }, [date]);

  if (isLoading) {
    return <CreditTransactionSkeleton />;
  }

  return (
    <TransactionsDataTable
      data={transactions.map(
        (transaction: ApiCreditTransaction) =>
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
            isRecurring: transaction.isRecurring,
            installmentNumber: transaction.installmentNumber,
            maxInstallments: transaction.maxInstallments,
          } as CreditTransaction)
      )}
      columns={dataTableColumns}
      categories={categories}
    />
  );
}
