"use client";

import { deleteTransaction } from "@/app/actions/transactions";
import { ConfirmDeleteDialog } from "@/components/shared/confirm-delete-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { Edit, MoreVertical, Trash } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface TransactionDataTableColumnActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  transactionId: string;
}

export function TransactionDataTableColumnActions({ transactionId }: TransactionDataTableColumnActionsProps) {
  const { toast } = useToast();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  async function onConfirmDelete(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    const response = await deleteTransaction(transactionId);
    setIsDeleteDialogOpen(false);

    if (response?.error) {
      toast({
        title: "Erro ao apagar transação",
        description: response.error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Transação apagada com sucesso",
    });
  }

  return (
    <div className="text-right pl-1">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Abrir menu</span>
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Ações</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <Link href={`/transacao/credito/${transactionId}/editar-transacao`}>
            <DropdownMenuItem>
              <Edit />
              Editar
            </DropdownMenuItem>
          </Link>
          <DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)}>
            <Trash />
            Apagar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ConfirmDeleteDialog
        title="Tem certeza?"
        description="Esta ação não pode ser desfeita. Esta transação será apagada permanentemente."
        isOpen={isDeleteDialogOpen}
        setIsOpen={setIsDeleteDialogOpen}
        onConfirm={onConfirmDelete}
      />
    </div>
  );
}
