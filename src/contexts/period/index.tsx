'use client';

import { parseStringToDate } from '@/lib/utils';
import { add, endOfMonth, format, startOfMonth } from 'date-fns';
import React, { createContext } from 'react';
import { DateRange } from 'react-day-picker';

type PeriodContextType = {
  date: DateRange;
};

type PeriodControlContextType = {
  date: DateRange | undefined;
  currentMonthLabel: string;
  setDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
  month: Date;
  setMonth: React.Dispatch<React.SetStateAction<Date>>;
  goToPreviousMonth: () => void;
  goToCurrentMonth: () => void;
  goToNextMonth: () => void;
};

const PeriodContext = createContext<PeriodContextType>({} as PeriodContextType);
const PeriodControlContext = createContext<PeriodControlContextType>(
  {} as PeriodControlContextType
);

export const PeriodProvider = ({ children }: { children: React.ReactNode }) => {
  const from = sessionStorage.getItem('from');
  const to = sessionStorage.getItem('to');
  const currentMonthLabel = format(new Date(), "MMMM 'de' yyyy");

  const [date, setDate] = React.useState<DateRange | undefined>({
    from: parseStringToDate(from, startOfMonth),
    to: parseStringToDate(to, endOfMonth),
  });
  const [month, setMonth] = React.useState<Date>(date?.from || new Date());

  const goToCurrentMonth = () => {
    setDate({
      from: startOfMonth(new Date()),
      to: endOfMonth(new Date()),
    });
  };

  const addMonthsToDate = (addMonths: number) => {
    const from = startOfMonth(
      add(date?.from || new Date(), { months: addMonths })
    );
    const to = endOfMonth(add(date?.from || new Date(), { months: addMonths }));
    setDate({ from, to });
  };

  const goToPreviousMonth = () => addMonthsToDate(-1);
  const goToNextMonth = () => addMonthsToDate(1);

  React.useEffect(() => {
    if (!date?.from || !date?.to) return;
    setMonth(date.from);
    sessionStorage.setItem('from', format(date.from, 'yyyy-MM-dd'));
    sessionStorage.setItem('to', format(date.to, 'yyyy-MM-dd'));
  }, [date]);

  return (
    <PeriodContext.Provider
      value={{
        date: date!,
      }}
    >
      <PeriodControlContext.Provider
        value={{
          date,
          currentMonthLabel,
          setDate,
          month,
          setMonth,
          goToPreviousMonth,
          goToCurrentMonth,
          goToNextMonth,
        }}
      >
        {children}
      </PeriodControlContext.Provider>
    </PeriodContext.Provider>
  );
};

const usePeriod = () => React.useContext(PeriodContext);
const usePeriodControl = () => {
  const context = React.useContext(PeriodControlContext);
  if (!context) {
    throw new Error('usePeriodControl must be used within a PeriodProvider.');
  }
  return context;
};

export { usePeriod, usePeriodControl };
