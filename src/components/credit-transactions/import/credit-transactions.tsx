"use client";

import { createAllTransactions } from "@/app/actions/credit-transactions";
import BancoInterCSVConfig from "@/app/types/csv/banco-inter";
import CsvConfig from "@/app/types/csv/csv-config";
import { Category } from "@/app/types/entities";
import ReadCSVInput from "@/components/shared/read-csv-input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCaption, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Rows, SaveAll } from "lucide-react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import EditableRow from "./table/editable-row";
import { parseBRLToFloat, parseToDateFromFormat } from "@/lib/utils";

export type CreateCreditTransactions = {
  date: Date;
  description: string;
  value: number;
  categoryId: string;
  numberOfInstallments: number | null;
  isRecurring?: boolean;
};

const configBanks = {
  ["inter"]: BancoInterCSVConfig,
};

export default function ImportCreditTransactions({ categories }: { categories: Category[] }) {
  const { toast } = useToast();

  const [csvConfig, setCsvConfig] = useState<CsvConfig | null>(null);
  const [transactions, setTransactions] = useState<CreateCreditTransactions[]>([]);
  const [canSaveAll, setCanSaveAll] = useState(false);

  function handleCsvData(raw: Papa.ParseResult<any>) {
    if (!csvConfig) {
      toast({
        title: "Selecione o banco de origem do arquivo",
        variant: "destructive",
      });
      return;
    }

    if (!csvConfig.EXPECTED_HEADERS.every((header) => raw.meta.fields?.includes(header))) {
      toast({
        title: "O arquivo CSV não possui as colunas esperadas",
        variant: "destructive",
      });
      return;
    }

    const transactions = raw.data.map((data: { [key: string]: string }) => {
      const fields = csvConfig!.MAPPER;
      const value = parseBRLToFloat(data[fields.value]);
      return {
        date: parseToDateFromFormat(data[fields.date], "dd/MM/yyyy"),
        description: data[fields.description],
        value: value < 0 ? value : value * -1,
        categoryId: "",
        numberOfInstallments: csvConfig!.handleInstallments(data),
        isRecurring: false,
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
    redirect("/transacao/credito");
  }

  useEffect(() => {
    setCanSaveAll(validateTransactions());
  }, [transactions]);

  return (
    <section>
      {!transactions.length && (
        <>
          <div>
            <p>Selecione o banco que este extrato pertence</p>
            <Select
              onValueChange={(value) => {
                const Config = configBanks[value as keyof typeof configBanks];
                if (!Config) {
                  return;
                }
                setCsvConfig(new Config());
              }}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Selecione o banco" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Bancos</SelectLabel>
                  <SelectItem value="inter">Banco Inter</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <ReadCSVInput
            separator={";"}
            onLoadData={handleCsvData}
            label="Selecione um extrato (csv)"
            loadingMessage="Lendo os dados do extrato..."
          />
        </>
      )}

      {!!transactions.length && (
        <>
          <Table>
            <TableCaption>Transações carregadas do extrato.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px]">Data de lançamento</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead className="text-center">Categoria</TableHead>
                <TableHead className="text-center">Parcelas</TableHead>
                <TableHead className="text-center">Recorrência</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead className="text-center">Ação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction, index) => (
                <EditableRow
                  key={index}
                  transaction={transaction}
                  categories={categories}
                  onSave={(transaction: CreateCreditTransactions) => {
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
