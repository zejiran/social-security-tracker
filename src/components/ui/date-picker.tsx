'use client';

import { format } from 'date-fns';
import { Calendar as CalendarIcon, LucideChevronsLeft, LucideChevronsRight } from 'lucide-react';
import * as React from 'react';

import { cn } from '../../lib/utils';

import { Button } from './button';
import { Calendar } from './calendar';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

export interface DatePickerProps {
  value?: Date;
  onChange?: (date?: Date) => void;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  dateFormat?: string;
  showMonthYearPicker?: boolean;
  monthFormat?: string;
}

export function DatePicker({
  value,
  onChange,
  className,
  placeholder = 'Select date',
  disabled = false,
  dateFormat = 'PPP',
  showMonthYearPicker = false,
  monthFormat = 'MMMM yyyy',
}: DatePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(value);

  React.useEffect(() => {
    setDate(value);
  }, [value]);

  const handleSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (onChange) {
      onChange(selectedDate);
    }
  };

  const formattedDate = date
    ? showMonthYearPicker
      ? format(date, monthFormat)
      : format(date, dateFormat)
    : undefined;

  const [calendarMonth, setCalendarMonth] = React.useState<Date>(date || new Date());

  React.useEffect(() => {
    if (date) {
      setCalendarMonth(date);
    }
  }, [date]);

  const handlePrevMonth = () => {
    const prevMonth = new Date(calendarMonth);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    setCalendarMonth(prevMonth);
  };

  const handleNextMonth = () => {
    const nextMonth = new Date(calendarMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    setCalendarMonth(nextMonth);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'w-full justify-start text-left font-normal',
            !date && 'text-muted-foreground',
            className
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {formattedDate || <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-white" align="start">
        <div className="flex items-center justify-between px-3 py-2 bg-muted/20">
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePrevMonth}
            className="h-7 w-7 p-0 hover:bg-primary/10"
          >
            <span className="sr-only">Previous month</span>
            <LucideChevronsLeft />
          </Button>
          <div className="font-bold text-sm">{format(calendarMonth, 'MMMM yyyy')}</div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleNextMonth}
            className="h-7 w-7 p-0 hover:bg-primary"
          >
            <span className="sr-only">Next month</span>
            <LucideChevronsRight />
          </Button>
        </div>
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          month={calendarMonth}
          onMonthChange={setCalendarMonth}
          classNames={{
            months: 'flex flex-col sm:flex-row sm:space-x-4 sm:space-y-0',
            caption: 'hidden',
            nav: 'hidden',
            caption_label: 'hidden',
            table: 'w-full border-collapse space-y-1 mt-1',
            head_row: 'flex',
            head_cell: 'text-primary rounded-md w-9 font-normal text-[0.8rem]',
            row: 'flex w-full mt-2',
            cell: 'h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
            day: 'h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-accent rounded-md text-center focus:bg-[--background]',
            selected:
              'bg-[--background] hover:bg-[--background] text-primary-foreground hover:text-primary-foreground',
            today: 'bg-accent text-accent-foreground',
          }}
        />
      </PopoverContent>
    </Popover>
  );
}

export interface MonthPickerProps
  extends Omit<DatePickerProps, 'dateFormat' | 'showMonthYearPicker'> {
  className?: string;
  defaultToPreviousMonth?: boolean;
}

export function MonthPicker({
  value,
  onChange,
  className,
  placeholder = 'Select month',
  disabled = false,
  defaultToPreviousMonth = false,
}: MonthPickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(value);
  const [open, setOpen] = React.useState(false);
  React.useEffect(() => {
    if (!value && defaultToPreviousMonth) {
      const prevMonth = new Date();
      prevMonth.setMonth(prevMonth.getMonth() - 1);
      setDate(prevMonth);
      if (onChange) {
        onChange(prevMonth);
      }
    } else {
      setDate(value);
    }
  }, [value, onChange, defaultToPreviousMonth]);

  const handleSelectMonth = (month: number) => {
    const newDate = date ? new Date(date) : new Date();
    newDate.setMonth(month);
    setDate(newDate);
    if (onChange) {
      onChange(newDate);
    }
    setOpen(false);
  };

  const handleSelectYear = (increment: number) => {
    const newDate = date ? new Date(date) : new Date();
    newDate.setFullYear(newDate.getFullYear() + increment);
    setDate(newDate);
    if (onChange) {
      onChange(newDate);
    }
  };

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const formattedDate = date ? format(date, 'MMMM yyyy') : placeholder;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'w-full justify-start text-left font-normal',
            !date && 'text-muted-foreground',
            className
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {formattedDate}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4 bg-white" align="start">
        <div className="flex justify-between items-center mb-3">
          <LucideChevronsLeft onClick={() => handleSelectYear(-1)} />
          <div className="font-medium">{date ? date.getFullYear() : new Date().getFullYear()}</div>
          <LucideChevronsRight onClick={() => handleSelectYear(1)} />
        </div>
        <div className="grid grid-cols-3 gap-2">
          {months.map((month, index) => (
            <Button
              key={month}
              variant={date && date.getMonth() === index ? 'default' : 'outline'}
              size="sm"
              className={cn(
                'h-9',
                date &&
                  date.getMonth() === index &&
                  'bg-[--background] hover:bg-[--background] text-primary-foreground'
              )}
              onClick={() => handleSelectMonth(index)}
            >
              {month.substring(0, 3)}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
