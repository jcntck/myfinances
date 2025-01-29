"use client";

import { updateCategory } from "@/app/actions/category";
import { Category } from "@/app/types/entities";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const editCategorySchema = z.object({
  name: z.string().min(2, {
    message: "Nome é obrigatória.",
  }),
});

export function CategoryFormEdit({ category }: { category: Category }) {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof editCategorySchema>>({
    resolver: zodResolver(editCategorySchema),
    defaultValues: {
      name: category.name,
    },
  });

  async function onSubmit(values: z.infer<typeof editCategorySchema>) {
    const response = await updateCategory(values, category.id);
    if (response.error) {
      toast({
        title: `Erro ao atualizar categoria`,
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

        <Button type="submit">Editar</Button>
      </form>
    </Form>
  );
}
