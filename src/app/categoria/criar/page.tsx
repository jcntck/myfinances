import { CategoryFormCreate } from "@/components/category/form/create";

export default async function CategoryCreatePage() {
  return (
    <div className="container mx-auto py-4 flex flex-col gap-2">
      <div className="flex items-center justify-between border-b pb-2">
        <h1 className="scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0">Novo registro - Categoria</h1>
      </div>
      <section>
        <CategoryFormCreate />
      </section>
    </div>
  );
}
