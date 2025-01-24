import { Category } from "@/app/types/entities";
import { Combobox } from "@/components/shared/combobox";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Table } from "@tanstack/react-table";

interface TransactionsDataTableFiltersProps<TData> extends React.HTMLAttributes<HTMLDivElement> {
  table: Table<TData>;
  categories: Category[];
}

export function TransactionsDataTableFilters<TData>({
  className,
  table,
  categories,
}: TransactionsDataTableFiltersProps<TData>) {
  return (
    <div className={cn("flex items-center gap-2 px-2 py-1 md:px-0", className)}>
      <Input
        placeholder="Buscar por descrição..."
        value={(table.getColumn("description")?.getFilterValue() as string) ?? ""}
        onChange={(event) => table.getColumn("description")?.setFilterValue(event.target.value)}
        className="w-full sm:max-w-sm md:max-w-xs"
      />
      <Combobox
        options={categories.map((category) => ({
          label: category.name,
          value: category.id,
        }))}
        placeholder="Selecione uma categoria..."
        searchPlaceholder="Procurar uma categoria..."
        notFoundMessage="Categoria não encontrada."
        value={table.getColumn("category")?.getFilterValue() as string}
        onValueChange={(newValue) => table.getColumn("category")?.setFilterValue(newValue)}
      />
    </div>
  );
}
