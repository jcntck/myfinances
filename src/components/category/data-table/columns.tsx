"use client";

import { Category } from "@/app/types/entities";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { ColumnDef } from "@tanstack/react-table";
import { CategoryDataTableColumnActions } from "./column-actions";

export const dataTableColumns: ColumnDef<Category>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Categoria" />,
    enableHiding: false,
  },
  {
    id: "actions",
    size: 75,
    cell: ({ row }) => {
      const category = row.original;
      return <CategoryDataTableColumnActions categoryId={category.id} />;
    },
  },
];
