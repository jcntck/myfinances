import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseToBRLCurrency(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export const parseBRLToFloat = (value: string): number => {
  return parseFloat(value.replace(/[^\d,]/g, "").replace(",", "."));
};

export const parseStringToDate = (date: string | null, dateFnsHelper: Function) => {
  if (!date) return dateFnsHelper(new Date());
  return new Date(`${date}T00:00:00`);
};
