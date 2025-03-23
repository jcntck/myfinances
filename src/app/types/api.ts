export type ApiDebitTransaction = {
  id: string;
  date: string;
  description: string;
  value: number;
  categoryId: string;
  categoryName: string;
  status: "pending" | "paid";
};

export type ApiCreditTransaction = ApiDebitTransaction & {
  isRecurring: boolean;
  installmentNumber: number | null;
  maxInstallments: number | null;
};
