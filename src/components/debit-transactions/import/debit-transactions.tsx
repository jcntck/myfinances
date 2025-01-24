"use client";

import { Category } from "@/app/types/entities";
import ReadCSVInput from "@/components/shared/read-csv-input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCaption, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { parseBRLToFloat, parseToDateFromFormat } from "@/lib/utils";
import { SaveAll } from "lucide-react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import EditableRow from "./table/editable-row";
import { createAllTransactions } from "@/app/actions/transactions";

const expectedHeaders = ["data", "descricao", "valor"];

export type CreateDebitTransaction = {
  date: Date;
  description: string;
  value: number;
  categoryId: string;
};

export default function ImportDebitTransactions({ categories }: { categories: Category[] }) {
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<CreateDebitTransaction[]>([]);
  const [canSaveAll, setCanSaveAll] = useState(false);

  function handleCsvData(data: string[][]) {
    const headers = data.shift();
    if (!expectedHeaders.every((header) => headers?.includes(header))) {
      toast({
        title: "O arquivo CSV não possui as colunas esperadas",
        variant: "destructive",
      });
      return;
    }

    const rows = data.filter((row) => row.length === 3);
    const transactions = rows.map((row) => {
      const [date, description, value] = row;
      return {
        date: parseToDateFromFormat(date, "dd/MM/yyyy"),
        description,
        value: parseBRLToFloat(value),
        categoryId: "",
      };
    });

    setTransactions(transactions);
  }

  function validateTransactions() {
    return transactions.every((transaction) => transaction.categoryId && transaction.description);
  }

  async function handleSaveAll() {
    const response = await createAllTransactions(transactions);
    if (response.error) {
      toast({
        title: "Erro ao salvar transações",
        description: response.error,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Transações criadas com sucesso!",
        description: response.message,
      });
    }
    redirect("/transacao/debito");
  }

  useEffect(() => {
    setCanSaveAll(validateTransactions());
  }, [transactions]);

  return (
    <section>
      {!transactions.length && (
        <ReadCSVInput
          onLoadData={handleCsvData}
          label="Selecione um extrato (csv)"
          loadingMessage="Lendo os dados do extrato..."
        />
      )}

      {!!transactions.length && (
        <>
          <Table>
            <TableCaption>Transações carregadas do extrato.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px]">Data de lançamento</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead className="w-[150px] text-right">Valor</TableHead>
                <TableHead className="text-center">Ação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction, index) => (
                <EditableRow
                  key={index}
                  transaction={transaction}
                  categories={categories}
                  onSave={(transaction: CreateDebitTransaction) => {
                    setTransactions((prevTransactions) => {
                      const newTransactions = [...prevTransactions];
                      newTransactions[index] = transaction;
                      return newTransactions;
                    });
                  }}
                />
              ))}
            </TableBody>
          </Table>
          <div className="mt-4 flex justify-end">
            <Button type="button" disabled={!canSaveAll} onClick={handleSaveAll}>
              <SaveAll />
              Salvar transações
            </Button>
          </div>
        </>
      )}
    </section>
  );
}
