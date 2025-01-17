export type DebitTransaction = {
  id: string;
  date: string;
  description: string;
  value: number;
  category: { id: string; name: string };
  status: "pending" | "paid";
};

export type Category = {
  id: string;
  name: string;
};
