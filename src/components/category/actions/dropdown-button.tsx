"use client";

import { Table } from "@tanstack/react-table";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import Link from "next/link";

interface TransactionsActionsProps<TData> {
  table: Table<TData>;
}

export function ActionsDropdownButton<TData>({ table }: TransactionsActionsProps<TData>) {
  return (
    <Link href="/categoria/criar">
      <Button className="grow h-8 flex md:grow-0">
        <Plus className="h-4 w-4" />
        Novo registro
      </Button>
    </Link>
  );
}
