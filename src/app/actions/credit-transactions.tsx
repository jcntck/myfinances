"use server";

import Application from "@/Application";
import { createTransactionSchema } from "@/components/credit-transactions/form/create";
import { editTransactionSchema } from "@/components/credit-transactions/form/edit";
import { CreateCreditTransactions } from "@/components/credit-transactions/import/credit-transactions";
import { CreateCreditTransactionInput } from "@/core/application/usecase/credit-transactions/CreateCreditTransaction";
import { UpdateCreditTransactionInput } from "@/core/application/usecase/credit-transactions/UpdateCreditTransaction";
import { parseBRLToFloat } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

export async function createTransaction(data: z.infer<typeof createTransactionSchema>) {
  const { CreateCreditTransaction } = Application.Instance.CreditTransaction;
  console.log(data);
  try {
    let numberOfInstallments;

    if (data.isInstallment) {
      numberOfInstallments = parseInt(data.installments as string);
    }

    const input: CreateCreditTransactionInput = {
      date: data.date,
      description: data.description,
      value: parseBRLToFloat(data.value),
      categoryId: data.categoryId,
      isRecurring: data.isRecurrent,
      numberOfInstallments,
    };
    await CreateCreditTransaction.execute(input);
  } catch (err) {
    console.error(err);
    return {
      error: {
        message: "Ocorreu um erro ao criar a transação. Contate o suporte.",
      },
    };
  }

  revalidatePath("/transacao/credito");
  redirect("/transacao/credito");
}

export async function updateTransaction(data: z.infer<typeof editTransactionSchema>, id: string) {
  const { UpdateCreditTransaction } = Application.Instance.CreditTransaction;

  try {
    const input: UpdateCreditTransactionInput = {
      id,
      description: data.description,
      categoryId: data.categoryId,
    };
    await UpdateCreditTransaction.execute(input);
  } catch (err) {
    console.error(err);
    return {
      error: {
        message: "Ocorreu um erro ao atualizar a transação. Contate o suporte.",
      },
    };
  }

  revalidatePath("/transacao/credito");
  redirect("/transacao/credito");
}

export async function deleteTransaction(id: string) {
  const { DeleteCreditTransaction } = Application.Instance.CreditTransaction;

  try {
    await DeleteCreditTransaction.execute(id);
  } catch (err) {
    console.error(err);
    return {
      error: {
        message: "Ocorreu um erro ao deletar a transação. Contate o suporte.",
      },
    };
  }

  revalidatePath("/transacao/credito");
}

export async function createAllTransactions(data: CreateCreditTransactions[]) {
  const { ImportCreditTransactions } = Application.Instance.CreditTransaction;
  try {
    const transactions = data.map((transaction) => {
      return {
        ...transaction,
        numberOfInstallments: transaction.numberOfInstallments ?? undefined,
      };
    });
    await ImportCreditTransactions.execute(transactions);
    return { message: `Todas as transações foram importadas com sucesso.` };
  } catch (err) {
    console.error(err);
    return {
      error: "Ocorreu um erro ao importar as transações. Contate o suporte.",
    };
  }
}
