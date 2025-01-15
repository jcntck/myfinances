"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { endOfMonth, format, isFirstDayOfMonth, isLastDayOfMonth, isSameMonth, parse, startOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import * as React from "react";
import { DateRange } from "react-day-picker";

const parseStringToDate = (date: string | null, dateFnsHelper: Function) => {
  if (!date) return dateFnsHelper(new Date());
  return parse(date, "yyyy-MM-dd", new Date());
};

function ButtonLabel({ dateRange }: { dateRange: DateRange | undefined }) {
  if (!dateRange || !dateRange.from || !dateRange.to) {
    return <span>Escolha uma data</span>;
  }
  const { from, to } = dateRange;
  if (isSameMonth(from, to) && isFirstDayOfMonth(from) && isLastDayOfMonth(to)) {
    return <span className="uppercase">{format(from, "MMMM 'de' yyyy")}</span>;
  }
  return (
    <>
      {format(from, "dd MMM y")} - {format(to, "dd MMM y")}
    </>
  );
}

export function DatePickerWithRange() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [date, setDate] = React.useState<DateRange | undefined>({
    from: parseStringToDate(searchParams.get("from"), startOfMonth),
    to: parseStringToDate(searchParams.get("to"), endOfMonth),
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
            <ButtonLabel dateRange={date} />
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
