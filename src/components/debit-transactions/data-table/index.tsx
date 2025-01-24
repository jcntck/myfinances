"use client";

import { Category } from "@/app/types/entities";
import { ActionsDropdownButton } from "@/components/debit-transactions/actions/dropdown-button";
import { DataTableViewOptions } from "@/components/ui/data-table-view-options";
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
import * as React from "react";
import { TransactionsDataTableFilters } from "./filters";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  categories: Category[];
}

export function TransactionsDataTable<TData, TValue>({ columns, data, categories }: DataTableProps<TData, TValue>) {
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
    initialState: {
      columnVisibility: {
        status: false,
      },
    },
  });

  return (
    <div>
      <section className="mb-3 flex flex-col md:flex-row md:gap-2 md:items-center">
        <TransactionsDataTableFilters className="w-full flex-col sm:flex-row" table={table} categories={categories} />
        <div className="flex gap-3 border-t px-2 py-1 md:border-t-0 md:ml-auto md:px-0">
          <DataTableViewOptions table={table} />
          <ActionsDropdownButton table={table} />
        </div>
      </section>
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
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Sem registros.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            {table.getFooterGroups().map((footerGroup) => (
              <TableRow key={`footer-${footerGroup.id}`}>
                {footerGroup.headers.map((footer) => (
                  <TableCell key={footer.id}>
                    {footer.isPlaceholder ? null : flexRender(footer.column.columnDef.footer, footer.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableFooter>
        </Table>
      </div>
    </div>
  );
}
