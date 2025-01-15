import { Category } from "@/app/_types/entities";
import { TransactionForm } from "@/components/transactions/form";

const categories: Category[] = [
  {
    id: "category-1",
    name: "Category 01",
  },
  {
    id: "category-2",
    name: "Category 02",
  },
  {
    id: "category-3",
    name: "Category 03",
  },
  {
    id: "category-4",
    name: "Category 04",
  },
  {
    id: "category-5",
    name: "Category 05",
  },
];

export default async function DebitTransactionCreatePage() {
  return (
    <main className="container mx-auto py-4 flex flex-col gap-2">
      <div className="flex items-center justify-between border-b pb-2">
        <h1 className="scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0">
          Novo registro - Transações de débito
        </h1>
      </div>
      <section>
        <TransactionForm categories={categories} />
      </section>
    </main>
  );
}
