'use client';

import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { Table } from '@tanstack/react-table';
import {
  DiamondPlus,
  FileUp,
  MoreHorizontal,
  Plus,
  Settings2,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

interface TransactionsActionsProps<TData> {
  table: Table<TData>;
}

export function TransactionsActions<TData>({
  table,
}: TransactionsActionsProps<TData>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" className="grow h-8 flex md:grow-0">
          <Plus />
          <span className="md:sr-only">Ação</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[98vw] md:w-[150px]">
        <DropdownMenuItem>
          <Plus className="mr-2 h-4 w-4" />
          Novo registro
        </DropdownMenuItem>
        <DropdownMenuItem>
          <FileUp className="mr-2 h-4 w-4" />
          Importar registros
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

