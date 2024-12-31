"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  endOfMonth,
  format,
  isFirstDayOfMonth,
  isLastDayOfMonth,
  isSameMonth,
  setDefaultOptions,
  startOfMonth,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import * as React from "react";
import { DateRange } from "react-day-picker";

setDefaultOptions({ locale: ptBR });

export function DatePickerWithRange({}: React.HTMLAttributes<HTMLDivElement>) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const createQueryString = React.useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  const now = new Date();
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: startOfMonth(now),
    to: endOfMonth(now),
  });

  function handleClose() {
    if (!date) return;
    const { from, to } = date;
    const params = new URLSearchParams(searchParams.toString());
    if (from) params.set("from", format(from, "yyyy-MM-dd"));
    if (to) params.set("to", format(to, "yyyy-MM-dd"));
    router.push(`${pathname}?${params}`);
  }

  return (
    <div className="grid gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className={cn("justify-start text-left font-normal", !date && "text-muted-foreground")}
          >
            <CalendarIcon />
            {getLabel(date)}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end" onCloseAutoFocus={handleClose}>
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
            locale={ptBR}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

function getLabel(dateRange: DateRange | undefined) {
  if (!dateRange || !dateRange.from || !dateRange.to) {
    return <span>Escolha uma data</span>;
  }
  const { from, to } = dateRange;
  if (isSameMonth(from, to) && isFirstDayOfMonth(from) && isLastDayOfMonth(to)) {
    return <span className="capitalize">{format(from, "MMMM")}</span>;
  }
  return (
    <>
      {format(from, "dd MMM y")} - {format(to, "dd MMM y")}
    </>
  );
}
