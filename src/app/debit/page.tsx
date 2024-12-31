import { columns, TransactionsTable } from "@/app/debit/table";

export type DebitTransaction = {
  id: string;
  date: Date;
  description: string;
  value: number;
  category: string;
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
        <h1 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">
          Transações de débito
        </h1>
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

const generateDummyTransactions = (length: number): DebitTransaction[] => {
  const categories = ["Category 01", "Category 02", "Category 03", "Category 04"];
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
