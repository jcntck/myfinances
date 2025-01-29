import { Category } from "@/app/types/entities";
import Application from "@/Application";
import { CategoriesDataTable } from "@/components/category/data-table";
import { dataTableColumns } from "@/components/category/data-table/columns";
import { getAllPaginatedRecords } from "@/lib/get-all-paginated-records";

export default async function CategoryPage() {
  const { ListCategories } = Application.Instance.Category;
  const categories = await getAllPaginatedRecords(ListCategories, 1000);
  return (
    <div className="container mx-auto py-4 flex flex-col gap-2">
      <div className="flex items-center justify-between border-b pb-2">
        <h1 className="scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0">Categorias</h1>
      </div>
      <CategoriesDataTable
        data={categories.map((category: Category) => ({
          id: category.id,
          name: category.name,
        }))}
        columns={dataTableColumns}
      />
    </div>
  );
}
