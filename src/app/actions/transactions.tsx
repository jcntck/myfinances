"use server";

import Application from "@/Application";
import { CreateDebitTransactionInput } from "@/application/usecase/debit-transactions/CreateDebitTransaction";
import { formSchema } from "@/components/transactions/form";
import { z } from "zod";

export async function createTransaction(data: z.infer<typeof formSchema>) {
  console.log("in action", data);
  const { CreateDebitTransaction } = Application.Instance.DebitTransaction;

  const demo: CreateDebitTransactionInput = {
    date: new Date(),
    description: "Transaction description",
    value: 10,
    categoryId: "234b0fe1-29b6-4971-8235-8b0d7a572e84",
  };
  await CreateDebitTransaction.execute(demo);
}
