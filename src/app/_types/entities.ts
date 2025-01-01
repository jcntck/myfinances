export type DebitTransaction = {
  id: string;
  date: Date;
  description: string;
  value: number;
  category: { id: string; name: string };
  status: "pending" | "paid";
};
