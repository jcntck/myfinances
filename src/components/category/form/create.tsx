"use client";

import { createCategory } from "@/app/actions/category";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().min(2, {
    message: "Nome é obrigatória.",
  }),
});

export function CategoryFormCreate() {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof createCategorySchema>>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: "",
    },
  });

  async function onSubmit(values: z.infer<typeof createCategorySchema>) {
    const response = await createCategory(values);
    if (response.error) {
      toast({
        title: `Erro ao criar transação`,
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Alimentação" {...field} />
              </FormControl>
              <FormDescription>Nome descritivo que representa a categoria.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Criar</Button>
      </form>
    </Form>
  );
}
