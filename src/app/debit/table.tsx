'use client';

import CategoryCombobox from '@/app/debit/category-combobox';
import { TransactionsActions } from '@/app/debit/transactions-actions';
import { DebitTransaction } from '@/app/_types/entities';
import { Button } from '@/components/ui/button';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { DataTableViewOptions } from '@/components/ui/data-table-view-options';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import clsx from 'clsx';
import { Circle, CircleCheck, MoreVertical } from 'lucide-react';
import * as React from 'react';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export const columns: ColumnDef<DebitTransaction>[] = [
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
      const formatted = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(amount);
      return <div className={clsx('font-medium text-right')}>{formatted}</div>;
    },
    footer: (info) => {
      const balance = info.table
        .getRowModel()
        .rows.values()
        .reduce((sum, row) => sum + parseFloat(row.getValue('value')), 0);
      const formatted = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(balance);
      return (
        <div className={clsx('font-semibold text-right')}>{formatted}</div>
      );
    },
    enableHiding: false,
  },
  {
    id: 'actions',
    size: 75,
    cell: ({ row }) => {
      const payment = row.original;
      return (
        <div className="text-right pl-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(payment.id)}
              >
                Copy payment ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View customer</DropdownMenuItem>
              <DropdownMenuItem>View payment details</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];

export function TransactionsTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
    initialState: {
      columnVisibility: {
        status: false,
      },
    },
  });

  const hasData = table.getRowModel().rows?.length;

  return (
    <div>
      <div className="flex py-4 gap-3">
        <Input
          placeholder="Buscar por descrição..."
          value={
            (table.getColumn('description')?.getFilterValue() as string) ?? ''
          }
          onChange={(event) =>
            table.getColumn('description')?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <CategoryCombobox
          value={table.getColumn('category')?.getFilterValue() as string}
          onValueChange={(newValue) =>
            table.getColumn('category')?.setFilterValue(newValue)
          }
        />
        <div className="ml-auto flex gap-3">
          <DataTableViewOptions table={table} />
          <TransactionsActions table={table} />
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {hasData ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <NoDataRow />
            )}
          </TableBody>
          <TableFooter>
            {table.getFooterGroups().map((footerGroup) => (
              <TableRow key={footerGroup.id}>
                {footerGroup.headers.map((footer) => (
                  <>
                    <TableCell key={footer.id}>
                      {footer.isPlaceholder
                        ? null
                        : flexRender(
                            footer.column.columnDef.footer,
                            footer.getContext()
                          )}
                    </TableCell>
                  </>
                ))}
              </TableRow>
            ))}
          </TableFooter>
        </Table>
      </div>
    </div>
  );
}

const NoDataRow = () => (
  <TableRow>
    <TableCell colSpan={columns.length} className="h-24 text-center">
      Sem registros.
    </TableCell>
  </TableRow>
);

