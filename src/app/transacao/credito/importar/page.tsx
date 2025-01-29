import Application from "@/Application";
import ImportCreditTransactions from "@/components/credit-transactions/import/credit-transactions";
import { getAllPaginatedRecords } from "@/lib/get-all-paginated-records";

export default async function DebitTransactionImportPage() {
  const { ListCategories } = Application.Instance.Category;
  const categories = await getAllPaginatedRecords(ListCategories, 1000);
  return (
    <div className="container mx-auto py-4 flex flex-col gap-2">
      <div className="flex flex-col gap-2 border-b pb-2">
        <h1 className="scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0">
          Importar registros - Transações de crédito
        </h1>
        <p>Selecione um extrato para importar suas transações para o sistema.</p>
      </div>
      <ImportCreditTransactions categories={categories} />
    </div>
  );
}
