"use client";

import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Table } from "@tanstack/react-table";
import { DiamondPlus, FileUp, MoreHorizontal, Plus, Settings2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface TransactionsActionsProps<TData> {
  table: Table<TData>;
}

export function TransactionsActions<TData>({ table }: TransactionsActionsProps<TData>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" className="h-8 flex">
          <Plus />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          <Plus className="mr-2 h-4 w-4" />
          Novo registro
        </DropdownMenuItem>
        <DropdownMenuItem>
          <FileUp className="mr-2 h-4 w-4" />
          Importar registros
        </DropdownMenuItem>
      </DropdownMenuContent>
      {/* <DropdownMenuContent align="end" className="w-[150px]">
        <DropdownMenuLabel>Visualizar</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {table
          .getAllColumns()
          .filter((column) => typeof column.accessorFn !== "undefined" && column.getCanHide())
          .map((column) => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {column.id}
              </DropdownMenuCheckboxItem>
            );
          })}
      </DropdownMenuContent> */}
    </DropdownMenu>
  );
}
