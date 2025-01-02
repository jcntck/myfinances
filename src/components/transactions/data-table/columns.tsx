'use client';

import { DebitTransaction } from '@/app/_types/entities';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { parseToBRLCurrency } from '@/lib/utils';
import { ColumnDef } from '@tanstack/react-table';
import clsx from 'clsx';
import { Circle, CircleCheck } from 'lucide-react';
import { TransactionDataTableColumnActions } from './column-actions';

export const dataTableColumns: ColumnDef<DebitTransaction>[] = [
  {
    accessorKey: 'date',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Data" />
    ),
    cell: ({ row }) => {
      const date = row.getValue('date') as Date;
      return date.toLocaleDateString();
    },
    footer: () => <span className="font-semibold">Saldo</span>,
    enableHiding: false,
  },
  {
    accessorKey: 'description',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Descrição" />
    ),
    enableHiding: false,
  },
  {
    accessorKey: 'category',
    accessorFn: (data) => data.category,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Categoria" />
    ),
    cell: ({ row }) => {
      const category = row.getValue('category') as { name: string };
      return category.name;
    },
    sortingFn: (rowA, rowB, columnId) => {
      const categoryA = rowA.getValue(columnId) as { name: string };
      const categoryB = rowB.getValue(columnId) as { name: string };
      if (categoryA.name < categoryB.name) return -1;
      if (categoryA.name > categoryB.name) return 1;
      return 0;
    },
    filterFn: (row, id, value) => {
      const category = row.getValue(id) as { id: string };
      return category.id === value;
    },
    enableHiding: false,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const isPaid = row.getValue('status') === 'paid';
      return (
        <div>
          {isPaid ? (
            <CircleCheck
              className="text-white bg-green-500 rounded-full"
              size={20}
            />
          ) : (
            <Circle className="text-gray-500" size={20} />
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'value',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Valor"
        className="justify-end"
      />
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('value'));
      return (
        <div className={clsx('font-medium text-right')}>
          {parseToBRLCurrency(amount)}
        </div>
      );
    },
    footer: (info) => {
      const balance = info.table
        .getRowModel()
        .rows.values()
        .reduce((sum, row) => sum + parseFloat(row.getValue('value')), 0);
      return (
        <div className={clsx('font-semibold text-right')}>
          {parseToBRLCurrency(balance)}
        </div>
      );
    },
    enableHiding: false,
  },
  {
    id: 'actions',
    size: 75,
    cell: ({ row }) => {
      const transactionId = row.original;
      return (
        <TransactionDataTableColumnActions transactionId={transactionId.id} />
      );
    },
  },
];
