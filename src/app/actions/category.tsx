"use server";

import Application from "@/Application";
import { createCategorySchema } from "@/components/category/form/create";
import { editCategorySchema } from "@/components/category/form/edit";
import { CreateCategoryInput } from "@/core/application/usecase/category/CreateCategory";
import { UpdateCategoryInput } from "@/core/application/usecase/category/UpdateCategory";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

export async function createCategory(data: z.infer<typeof createCategorySchema>) {
  const { CreateCategory } = Application.Instance.Category;

  try {
    const input: CreateCategoryInput = {
      name: data.name,
    };
    await CreateCategory.execute(input);
  } catch (err) {
    console.error(err);
    return {
      error: {
        message: "Ocorreu um erro ao criar a categoria. Contate o suporte.",
      },
    };
  }

  revalidatePath("/categoria");
  redirect("/categoria");
}

export async function updateCategory(data: z.infer<typeof editCategorySchema>, id: string) {
  const { UpdateCategory } = Application.Instance.Category;

  try {
    const input: UpdateCategoryInput = {
      id,
      name: data.name,
    };
    await UpdateCategory.execute(input);
  } catch (err) {
    console.error(err);
    return {
      error: {
        message: "Ocorreu um erro ao atualizar a categoria. Contate o suporte.",
      },
    };
  }

  revalidatePath("/categoria");
  redirect("/categoria");
}

export async function deleteCategory(id: string) {
  const { DeleteCategory } = Application.Instance.Category;

  try {
    await DeleteCategory.execute(id);
  } catch (err) {
    console.error(err);
    return {
      error: {
        message: "Ocorreu um erro ao deletar a categoria. Contate o suporte.",
      },
    };
  }

  revalidatePath("/categoria");
}
