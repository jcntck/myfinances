"use client";

import { Category } from "@/app/_types/entities";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { maskitoNumberOptionsGenerator } from "@maskito/kit";
import { useMaskito } from "@maskito/react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const formSchema = z.object({
  date: z.date({
    required_error: "A data da transação é obrigatória.",
  }),
  description: z.string().min(2, {
    message: "A descrição é obrigatória.",
  }),
  value: z.string().min(4, {
    message: "Valor é obrigatório.",
  }),
  categoryId: z.string().min(1, {
    message: "A categoria é obrigatória.",
  }),
});

export function TransactionForm({ categories }: { categories: Category[] }) {
  const categoriesOptions = categories.map((category) => ({
    label: category.name,
    value: category.id,
  }));

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date(),
      description: "",
      value: "",
      categoryId: "",
    },
  });

  const maskedValueInputRef = useMaskito({
    options: maskitoNumberOptionsGenerator({
      decimalZeroPadding: true,
      precision: 2,
      decimalSeparator: ",",
      min: 0,
      prefix: "R$ ",
    }),
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("in component", values);
    // createTransaction(values)
    //   .then((res) => console.log("inside component", res))
    //   .catch((err) => console.log("inside component", err));
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-6">
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Data da transação</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn("w-[240px] pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                    >
                      {field.value ? format(field.value, "dd/MM/y") : <span>Escolha uma data</span>}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    locale={ptBR}
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date("1900-01-01")}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
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
          name="value"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valor da transação</FormLabel>
              <FormControl>
                <Input
                  placeholder=""
                  {...field}
                  ref={maskedValueInputRef}
                  onInput={(evt) => {
                    form.setValue("value", evt.currentTarget.value);
                  }}
                />
              </FormControl>
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

        <Button type="submit">Criar</Button>
      </form>
    </Form>
  );
}
