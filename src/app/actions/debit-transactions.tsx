"use server";

import Application from "@/Application";
import { createTransactionSchema } from "@/components/debit-transactions/form/create";
import { editTransactionSchema } from "@/components/debit-transactions/form/edit";
import { CreateDebitTransaction } from "@/components/debit-transactions/import/debit-transactions";
import { CreateDebitTransactionInput } from "@/core/application/usecase/debit-transactions/CreateDebitTransaction";
import { UpdateDebitTransactionInput } from "@/core/application/usecase/debit-transactions/UpdateDebitTransaction";
import { parseBRLToFloat } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

export async function createTransaction(data: z.infer<typeof createTransactionSchema>) {
  const { CreateDebitTransaction } = Application.Instance.DebitTransaction;

  try {
    const input: CreateDebitTransactionInput = {
      date: data.date,
      description: data.description,
      value: parseBRLToFloat(data.value),
      categoryId: data.categoryId,
    };
    await CreateDebitTransaction.execute(input);
  } catch (err) {
    console.error(err);
    return {
      error: {
        message: "Ocorreu um erro ao criar a transação. Contate o suporte.",
      },
    };
  }

  revalidatePath("/transacao/debito");
  redirect("/transacao/debito");
}

export async function updateTransaction(data: z.infer<typeof editTransactionSchema>, id: string) {
  const { UpdateDebitTransaction } = Application.Instance.DebitTransaction;

  try {
    const input: UpdateDebitTransactionInput = {
      id,
      description: data.description,
      categoryId: data.categoryId,
    };
    await UpdateDebitTransaction.execute(input);
  } catch (err) {
    console.error(err);
    return {
      error: {
        message: "Ocorreu um erro ao atualizar a transação. Contate o suporte.",
      },
    };
  }

  revalidatePath("/transacao/debito");
  redirect("/transacao/debito");
}

export async function deleteTransaction(id: string) {
  const { DeleteDebitTransaction } = Application.Instance.DebitTransaction;

  try {
    await DeleteDebitTransaction.execute(id);
  } catch (err) {
    console.error(err);
    return {
      error: {
        message: "Ocorreu um erro ao deletar a transação. Contate o suporte.",
      },
    };
  }

  revalidatePath("/transacao/debito");
}

export async function createAllTransactions(data: CreateDebitTransaction[]) {
  const { ImportDebitTransaction } = Application.Instance.DebitTransaction;
  try {
    const ids = await ImportDebitTransaction.execute(data);
    return { message: `Foram importados um total de ${ids.length} transações.` };
  } catch (err) {
    console.error(err);
    return {
      error: "Ocorreu um erro ao importar as transações. Contate o suporte.",
    };
  }
}
