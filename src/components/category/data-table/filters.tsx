import { Category } from "@/app/types/entities";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Table } from "@tanstack/react-table";

interface CategoriesDataTableFilters<TData> extends React.HTMLAttributes<HTMLDivElement> {
  table: Table<TData>;
}

export function CategoriesDataTableFilters<TData>({ className, table }: CategoriesDataTableFilters<TData>) {
  return (
    <div className={cn("flex items-center gap-2 px-2 py-1 md:px-0", className)}>
      <Input
        placeholder="Buscar por descrição..."
        value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
        onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
        className="w-full sm:max-w-sm md:max-w-xs"
      />
    </div>
  );
}
