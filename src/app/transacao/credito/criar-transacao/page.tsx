import Application from "@/Application";
import { TransactionFormCreate } from "@/components/credit-transactions/form/create";
import { getAllPaginatedRecords } from "@/lib/get-all-paginated-records";

export default async function CreditTransactionCreatePage() {
  const { ListCategories } = Application.Instance.Category;
  const categories = await getAllPaginatedRecords(ListCategories, 1000);

  return (
    <div className="container mx-auto py-4 flex flex-col gap-2">
      <div className="flex items-center justify-between border-b pb-2">
        <h1 className="scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0">
          Novo registro - Transações de crédito
        </h1>
      </div>
      <section>
        <TransactionFormCreate categories={categories} />
      </section>
    </div>
  );
}
