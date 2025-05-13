import { Download, RefreshCw, X, List } from 'lucide-react';
import React, { useState, useEffect } from 'react';

import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardContent } from '../components/ui/card';
import { DatePicker, MonthPicker } from '../components/ui/date-picker';
import { Input } from '../components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../components/ui/tooltip';
import { EntryChangeFunction, IncomeEntry } from '../types';

interface IncomeTableProps {
  entries: IncomeEntry[];
  currentMonth: Date;
  onMonthChange: (date: Date) => void;
  onEntryChange: EntryChangeFunction;
  onTRMFetch: (entryIndex: number, date: Date) => Promise<void>;
  onExport: () => void;
  totalCOP: number;
}

const IncomeTable: React.FC<IncomeTableProps> = ({
  entries,
  currentMonth,
  onMonthChange,
  onEntryChange,
  onTRMFetch,
  onExport,
  totalCOP,
}) => {
  const [isLoading, setIsLoading] = useState<number | null>(null);

  const ensureDate = (dateValue: Date | string | undefined): Date => {
    if (!dateValue) {
      return new Date();
    }

    if (dateValue instanceof Date && !isNaN(dateValue.getTime())) {
      return dateValue;
    }

    try {
      const parsed = new Date(dateValue);
      if (!isNaN(parsed.getTime())) {
        return parsed;
      }
    } catch (e) {
      console.error('Failed to parse date:', dateValue);
    }

    return new Date();
  };

  const formatCOP = (value: number): string => {
    if (typeof value !== 'number' || isNaN(value)) {
      return '$0';
    }
    return `$${value.toLocaleString('es-CO')}`;
  };

  const handleTRMFetch = async (index: number, date: Date) => {
    try {
      setIsLoading(index);
      await onTRMFetch(index, date);
    } finally {
      setIsLoading(null);
    }
  };

  const getMonthName = (date: Date): string => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  useEffect(() => {
    const tableRows = document.querySelectorAll('.income-table tbody tr');
    tableRows.forEach((row, index) => {
      setTimeout(() => {
        (row as HTMLElement).style.opacity = '1';
        (row as HTMLElement).style.transform = 'translateY(0)';
      }, index * 100);
    });
  }, [entries]);

  return (
    <div className="income-dashboard fade-in">
      <div className="header-actions-bar mb-4">
        <div className="month-selector shadow-sm">
          <MonthPicker
            value={currentMonth}
            onChange={(date: Date | undefined) => date && onMonthChange(date)}
            placeholder="Select month"
            className="month-picker"
            defaultToPreviousMonth={true}
          />
        </div>

        <div className="action-buttons">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={onExport} className="export-button shadow-md">
                  <Download size={16} />
                  <span className="ml-2">Export to Excel</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Download Excel report</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <Card className="income-card shadow-lg mb-4">
        <CardHeader>
          <div className="flex justify-between items-center">
            <h4 className="mb-0 font-bold">
              Income for <span className="text-primary">{getMonthName(currentMonth)}</span>
            </h4>
            <Badge className="income-badge">{entries.length} Items</Badge>
          </div>
        </CardHeader>

        <CardContent>
          <div className="table-responsive">
            <Table className="custom-table income-table">
              <TableHeader>
                <TableRow>
                  <TableHead className="description-col">Description</TableHead>
                  <TableHead className="amount-col">USD</TableHead>
                  <TableHead className="date-col">Date</TableHead>
                  <TableHead className="trm-col">TRM</TableHead>
                  <TableHead className="cop-col">COP</TableHead>
                  <TableHead className="action-col">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.isArray(entries) && entries.length > 0 ? (
                  entries.map((entry, index) => (
                    <TableRow
                      key={index}
                      style={{
                        opacity: 0,
                        transform: 'translateY(10px)',
                        transition: 'all 0.3s ease-out',
                      }}
                    >
                      <TableCell>
                        <Input
                          type="text"
                          value={entry.name || ''}
                          onChange={e => onEntryChange(index, 'name', e.target.value)}
                          className="clean-input shadow-sm rounded-md"
                          placeholder="Description"
                        />
                      </TableCell>
                      <TableCell>
                        <div className="input-with-icon relative">
                          <div className="currency-symbol absolute left-3 top-1/2 transform -translate-y-1/2">
                            $
                          </div>
                          <Input
                            type="number"
                            value={entry.usd || ''}
                            onChange={e => onEntryChange(index, 'usd', Number(e.target.value) || 0)}
                            className="pl-6 currency-field clean-input shadow-sm rounded-md"
                            placeholder="0.00"
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <DatePicker
                          value={ensureDate(entry.date)}
                          onChange={(date: Date | undefined) => {
                            if (date) {
                              onEntryChange(index, 'date', date);
                              handleTRMFetch(index, date);
                            }
                          }}
                          className="w-full"
                          dateFormat="PP"
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        {entry.trm && entry.trm > 0 ? (
                          <div className="trm-value font-bold">{entry.trm.toFixed(2)}</div>
                        ) : entry.trm === 0 ? (
                          <Input
                            type="number"
                            placeholder="Enter TRM"
                            value={entry.trm || ''}
                            onChange={e => onEntryChange(index, 'trm', Number(e.target.value) || 0)}
                            className="clean-input shadow-sm rounded-md"
                          />
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleTRMFetch(index, ensureDate(entry.date))}
                            disabled={isLoading === index}
                            className="trm-fetch-btn shadow-sm h-8 px-3"
                          >
                            {isLoading === index ? (
                              <div className="h-4 w-4 border-2 border-b-transparent rounded-full animate-spin">
                                <span className="sr-only">Loading...</span>
                              </div>
                            ) : (
                              <>
                                <RefreshCw size={14} />
                                <span className="ml-1">Fetch</span>
                              </>
                            )}
                          </Button>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="cop-amount font-bold">
                          {entry.cop ? formatCOP(entry.cop) : '-'}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="action-buttons">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => onEntryChange(index, 'usd', 0)}
                                  className="icon-button shadow-sm h-8 w-8 p-0"
                                >
                                  <X size={16} />
                                  <span className="sr-only">Reset value</span>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Reset value</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      <div className="empty-state">
                        <div className="empty-icon">
                          <List size={32} />
                        </div>
                        <p className="empty-message">
                          No entries available. Please add items in the settings panel.
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
              <TableFooter>
                {Array.isArray(entries) && entries.length > 0 && (
                  <TableRow className="total-row">
                    <TableCell colSpan={4} className="text-right">
                      <strong>Total Amount:</strong>
                    </TableCell>
                    <TableCell className="text-right total-amount">
                      <strong className="text-primary text-xl">{formatCOP(totalCOP)}</strong>
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                )}
              </TableFooter>
            </Table>
          </div>

          <div className="income-info-box shadow-md mt-4">
            <div className="info-icon">ⓘ</div>
            <div className="info-text">
              <p>
                To add new income items or modify recurring items, go to the{' '}
                <strong>Settings</strong> tab.
              </p>
              <p className="mb-0">
                TRM values are fetched automatically from{' '}
                <span className="text-primary fw-medium">trm-colombia.vercel.app</span> API on the
                date selected. If unavailable, you can enter them manually.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IncomeTable;
