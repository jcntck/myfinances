"use client";

import { deleteCategory } from "@/app/actions/category";
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

interface CategoryDataTableColumnActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  categoryId: string;
}

export function CategoryDataTableColumnActions({ categoryId }: CategoryDataTableColumnActionsProps) {
  const { toast } = useToast();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  async function onConfirmDelete(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    const response = await deleteCategory(categoryId);
    setIsDeleteDialogOpen(false);

    if (response?.error) {
      toast({
        title: "Erro ao apagar categoria",
        description: response.error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Categoria apagada com sucesso",
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
          <Link href={`/categoria/${categoryId}/editar`}>
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
        description="Esta ação não pode ser desfeita. Esta categoria será apagada permanentemente."
        isOpen={isDeleteDialogOpen}
        setIsOpen={setIsDeleteDialogOpen}
        onConfirm={onConfirmDelete}
      />
    </div>
  );
}
