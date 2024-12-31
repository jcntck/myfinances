import { DatePickerWithRange } from "@/app/debit/date-picker-with-range";
import { columns, TransactionsTable } from "@/app/debit/table";

export type DebitTransaction = {
  id: string;
  date: Date;
  description: string;
  value: number;
  category: { id: string; name: string };
  status: "pending" | "paid";
};

export default async function Debit({}) {
  const transactions = generateDummyTransactions(10);
  const income = transactions.reduce((sum, transaction) => (transaction.value > 0 ? sum + transaction.value : sum), 0);
  const outcome = transactions.reduce((sum, transaction) => (transaction.value < 0 ? sum + transaction.value : sum), 0);
  const balance = income + outcome;
  return (
    <>
      <div className="container mx-auto py-4 flex flex-col gap-2">
        <div className="flex items-center justify-between border-b pb-2">
          <h1 className="scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0">Transações de débito</h1>
          <DatePickerWithRange />
        </div>
        <TransactionsTable
          data={transactions}
          columns={columns}
          info={{
            income,
            outcome,
            balance,
          }}
        />
      </div>
    </>
  );
}

const categories = [
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
];

const generateDummyTransactions = (length: number): DebitTransaction[] => {
  const now = new Date();
  return Array.from({ length }).map((_) => ({
    id: crypto.randomUUID(),
    date: new Date(now.setDate(Math.floor(Math.random() * 30) + 1)),
    description: `Description ${Date.now()}`,
    value: parseFloat(((Math.random() * 2 - 1) * 300).toFixed(2)),
    category: categories[Math.floor(Math.random() * 4)],
    status: Math.floor(Math.random() * 2) ? "paid" : "pending",
  }));
};
