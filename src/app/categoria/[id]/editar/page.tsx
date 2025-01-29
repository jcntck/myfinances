"use server";

import Application from "@/Application";
import { CategoryFormEdit } from "@/components/category/form/edit";

export default async function CategoryEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { GetCategory } = Application.Instance.Category;
  const category = await GetCategory.execute(id);
  return (
    <div className="container mx-auto py-4 flex flex-col gap-2">
      <div className="flex items-center justify-between border-b pb-2">
        <h1 className="scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0">Editar registro - Categoria</h1>
      </div>
      <section>
        <CategoryFormEdit category={category} />
      </section>
    </div>
  );
}
