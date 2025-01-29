"use client";

import { z } from "zod";
import { CreateCreditTransactions } from "../credit-transactions";
import { Category } from "@/app/types/entities";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { cn, parseToBRLCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, Circle, CircleCheck, Edit, Save } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Switch } from "@/components/ui/switch";

type EditableRowProps = {
  transaction: CreateCreditTransactions;
  onSave: (transaction: CreateCreditTransactions) => void;
  categories: Category[];
};

const schema = z
  .object({
    description: z.string().min(2, {
      message: "A descrição é obrigatória.",
    }),
    categoryId: z.string().min(1, {
      message: "A categoria é obrigatória.",
    }),
    numberOfInstallments: z.coerce.number().optional().or(z.literal("")),
    isRecurrent: z.boolean(),
  })
  .superRefine(({ numberOfInstallments, isRecurrent }, ctx) => {
    if (isRecurrent && numberOfInstallments) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Uma transação não pode ser recorrente e parcelada ao mesmo tempo.",
        path: ["isRecurrent"],
      });
    }
  });

export default function EditableRow({ transaction, categories, onSave }: EditableRowProps) {
  const [editMode, setEditMode] = useState(false);
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      description: transaction.description,
      categoryId: transaction.categoryId,
      numberOfInstallments: transaction.numberOfInstallments ?? "",
      isRecurrent: transaction.isRecurring,
    },
  });

  const categoriesOptions = categories.map((category) => ({
    label: category.name,
    value: category.id,
  }));

  async function onSubmit(values: z.infer<typeof schema>) {
    onSave({
      ...transaction,
      description: values.description,
      categoryId: values.categoryId,
      isRecurring: values.isRecurrent,
    });
    setEditMode(false);
  }

  return (
    <>
      {!editMode && (
        <TableRow>
          <TableCell className="font-medium">{transaction.date.toLocaleDateString()}</TableCell>
          <TableCell>{transaction.description}</TableCell>
          <TableCell className="text-center">
            {transaction.categoryId
              ? categories.find((category) => category.id == transaction.categoryId)?.name
              : "N/A"}
          </TableCell>
          <TableCell className="text-center">{transaction.numberOfInstallments ?? "À Vista"}</TableCell>
          <TableCell className="text-center">
            <div className="flex justify-center">
              {transaction.isRecurring ? (
                <CircleCheck className="text-white bg-green-500 rounded-full" size={20} />
              ) : (
                <Circle className="text-gray-500" size={20} />
              )}
            </div>
          </TableCell>
          <TableCell className="text-right whitespace-nowrap">{parseToBRLCurrency(transaction.value)}</TableCell>
          <TableCell className="text-center">
            <Button size="sm" variant="outline" onClick={() => setEditMode(true)}>
              <Edit />
              Editar
            </Button>
          </TableCell>
        </TableRow>
      )}

      {editMode && (
        <TableRow>
          <Form {...form}>
            <TableCell className="font-medium">{transaction.date.toLocaleDateString()}</TableCell>
            <TableCell>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Ex: Compra de roupas" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TableCell>
            <TableCell>
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
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
                                    className={cn(
                                      "ml-auto",
                                      option.value === field.value ? "opacity-100" : "opacity-0"
                                    )}
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
            </TableCell>
            <TableCell className="text-center">{transaction.numberOfInstallments ?? "À Vista"}</TableCell>
            <TableCell className="text-center">
              <FormField
                control={form.control}
                name="isRecurrent"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TableCell>
            <TableCell className="text-right">{parseToBRLCurrency(transaction.value)}</TableCell>
            <TableCell className="text-center">
              <Button size="sm" onClick={form.handleSubmit(onSubmit)}>
                <Save />
                Salvar
              </Button>
            </TableCell>
          </Form>
        </TableRow>
      )}
    </>
  );
}
