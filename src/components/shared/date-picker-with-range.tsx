'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { usePeriod, usePeriodControl } from '@/contexts/period';
import { cn } from '@/lib/utils';
import {
  format,
  isFirstDayOfMonth,
  isLastDayOfMonth,
  isSameMonth,
  setDefaultOptions,
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { DateRange } from 'react-day-picker';

setDefaultOptions({ locale: ptBR });

function ButtonLabel({ dateRange }: { dateRange: DateRange | undefined }) {
  if (!dateRange || !dateRange.from || !dateRange.to) {
    return <span>Escolha uma data</span>;
  }
  const { from, to } = dateRange;

  if (
    isSameMonth(from, to) &&
    isFirstDayOfMonth(from) &&
    isLastDayOfMonth(to)
  ) {
    return <span className="uppercase">{format(from, "MMMM 'de' yyyy")}</span>;
  }
  return (
    <>
      {format(from, 'dd MMM y')} - {format(to, 'dd MMM y')}
    </>
  );
}

export function DatePickerWithRange() {
  const controls = usePeriodControl();

  return (
    <div className="grid gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className={cn(
              'justify-start text-left font-normal',
              !controls.date && 'text-muted-foreground'
            )}
          >
            <CalendarIcon />
            <ButtonLabel dateRange={controls.date} />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto space-y-2 p-2" align="center">
          <div className="flex items-center gap-4 justify-center">
            <Button
              variant="outline"
              size="icon"
              onClick={controls.goToPreviousMonth}
            >
              <ChevronLeft />
            </Button>
            <Button variant="outline" onClick={controls.goToCurrentMonth}>
              Ir para
              <span className="font-semibold text-primary">
                {controls.currentMonthLabel}
              </span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={controls.goToNextMonth}
            >
              <ChevronRight />
            </Button>
          </div>
          <div className="rounded-md border">
            <Calendar
              initialFocus
              mode="range"
              month={controls.month}
              onMonthChange={controls.setMonth}
              selected={controls.date}
              onSelect={controls.setDate}
              numberOfMonths={2}
              locale={ptBR}
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

