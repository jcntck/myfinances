"use client";

import { DebitTransaction } from "@/app/debit/page";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import clsx from "clsx";
import { Circle, CircleCheck } from "lucide-react";
import * as React from "react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  info: {
    income: number;
    outcome: number;
    balance: number;
  };
}

export const columns: ColumnDef<DebitTransaction>[] = [
  {
    accessorKey: "date",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Data" />,
    cell: ({ row }) => {
      const date = row.getValue("date") as Date;
      return date.toLocaleDateString();
    },
    footer: () => <span className="font-semibold">Saldo</span>,
    enableHiding: false,
  },
  {
    accessorKey: "description",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Descrição" />,
  },
  {
    accessorKey: "category",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Categoria" />,
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const isPaid = row.getValue("status") === "paid";
      return (
        <div>
          {isPaid ? (
            <CircleCheck className="text-white bg-green-500 rounded-full" size={20} />
          ) : (
            <Circle className="text-gray-500" size={20} />
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "value",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Valor" />,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("value"));
      const formatted = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(amount);
      return <div className={clsx("font-medium")}>{formatted}</div>;
    },
    footer: (info) => {
      const balance = info.table
        .getRowModel()
        .rows.values()
        .reduce((sum, row) => sum + parseFloat(row.getValue("value")), 0);
      const formatted = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(balance);
      return <div className={clsx("font-semibold")}>{formatted}</div>;
    },
    enableHiding: false,
  },
];

export function TransactionsTable<TData, TValue>({ columns, data, info }: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
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
  });

  const hasData = table.getRowModel().rows?.length;

  return (
    <div>
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter description..."
          value={(table.getColumn("category")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("category")?.setFilterValue(event.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {hasData ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
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
                      {footer.isPlaceholder ? null : flexRender(footer.column.columnDef.footer, footer.getContext())}
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
