import { columns, Payment } from "@/app/payments/columns";
import { DataTable } from "@/app/payments/data-table";

export const payments: Payment[] = [
  {
    id: "728ed52f",
    amount: 100,
    status: "pending",
    email: "m@example.com",
  },
  {
    id: "489e1d42",
    amount: 125,
    status: "processing",
    email: "example@gmail.com",
  },
];

export default function Payments() {
  return (
    <>
      <DataTable columns={columns} data={payments} />
    </>
  );
}
