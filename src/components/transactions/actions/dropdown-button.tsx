'use client';

import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { Table } from '@tanstack/react-table';
import { FileUp, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';

interface TransactionsActionsProps<TData> {
  table: Table<TData>;
}

export function ActionsDropdownButton<TData>({
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
        <Link href="/transacao/debito/criar-transacao">
          <DropdownMenuItem>
            <Plus className="mr-2 h-4 w-4" />
            Novo registro
          </DropdownMenuItem>
        </Link>
        <Link href="/transacao/debito/importar">
          <DropdownMenuItem>
            <FileUp className="mr-2 h-4 w-4" />
            Importar registros
          </DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

