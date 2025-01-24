"use client";

import { updateTransaction } from "@/app/actions/transactions";
import { Category } from "@/app/types/entities";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { maskitoNumberOptionsGenerator } from "@maskito/kit";
import { useMaskito } from "@maskito/react";
import { Check, ChevronsUpDown } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const editTransactionSchema = z.object({
  description: z.string().min(2, {
    message: "A descrição é obrigatória.",
  }),
  categoryId: z.string().min(1, {
    message: "A categoria é obrigatória.",
  }),
});

type EditTransaction = {
  id: string;
  description: string;
  categoryId: string;
};

export function TransactionFormEdit({
  categories,
  transaction,
}: {
  categories: Category[];
  transaction: EditTransaction;
}) {
  const { toast } = useToast();

  const categoriesOptions = categories.map((category) => ({
    label: category.name,
    value: category.id,
  }));

  const form = useForm<z.infer<typeof editTransactionSchema>>({
    resolver: zodResolver(editTransactionSchema),
    defaultValues: {
      description: transaction.description,
      categoryId: transaction.categoryId,
    },
  });

  const maskedValueInputRef = useMaskito({
    options: maskitoNumberOptionsGenerator({
      decimalZeroPadding: true,
      thousandSeparator: ".",
      precision: 2,
      decimalSeparator: ",",
      min: 0,
      prefix: "R$ ",
    }),
  });

  async function onSubmit(values: z.infer<typeof editTransactionSchema>) {
    const response = await updateTransaction(values, transaction?.id);
    if (response.error) {
      toast({
        title: `Erro ao ${transaction ? "atualizar" : "criar"} transação`,
        description: response.error.message,
        variant: "destructive",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-6">
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Compra de roupas" {...field} />
              </FormControl>
              <FormDescription>Descrição breve da transação.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Categorias</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn("w-[250px] justify-between", !field.value && "text-muted-foreground")}
                    >
                      {field.value
                        ? categoriesOptions.find((option) => option.value === field.value)?.label
                        : "Selecione uma categoria..."}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput placeholder="Buscar uma categoria..." className="h-9" />
                    <CommandList>
                      <CommandEmpty>Nenhuma categoria encontrada.</CommandEmpty>
                      <CommandGroup>
                        {categoriesOptions.map((option) => (
                          <CommandItem
                            value={option.label}
                            key={option.value}
                            onSelect={() => {
                              form.setValue("categoryId", option.value);
                            }}
                          >
                            {option.label}
                            <Check
                              className={cn("ml-auto", option.value === field.value ? "opacity-100" : "opacity-0")}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Editar</Button>
      </form>
    </Form>
  );
}
