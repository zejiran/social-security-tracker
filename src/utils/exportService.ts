import { format } from 'date-fns';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

import { APP_CONFIG } from '../config';
import { IncomeEntry } from '../types';

import { calculateBothMethods } from './calculations';

/**
 * Exports income entries and social security calculations to Excel
 *
 * @param incomeEntries - Array of income entries
 * @param totalCOP - Total COP value
 * @param costosPercent - Costos percentage (0-1)
 * @param includeSolidarity - Whether to include solidarity
 * @param monthName - Name of the month (e.g., "April 2025")
 * @returns Promise resolving when export is complete
 */
export const exportToExcel = async (
  incomeEntries: IncomeEntry[],
  totalCOP: number,
  costosPercent: number,
  includeSolidarity: boolean,
  monthName: string
): Promise<void> => {
  const filteredEntries = incomeEntries.filter(entry => {
    const hasValue = entry.usd !== undefined && entry.usd !== null && entry.usd !== 0;
    const hasDate = entry.date !== undefined && entry.date !== null;
    return hasValue && hasDate;
  });

  const workbook = new ExcelJS.Workbook();
  const incomesSheet = workbook.addWorksheet('Ingresos');
  const socialSecuritySheet = workbook.addWorksheet('Social Security');

  const headerStyle = {
    font: { bold: true, color: { argb: 'FFFFFFFF' } },
    fill: { type: 'pattern', pattern: 'solid' as const, fgColor: { argb: 'FF0066CC' } },
    alignment: { horizontal: 'center' as const },
  };

  const currencyFormat = '#,##0';

  // =======================================================
  // Ingresos Sheet
  // =======================================================

  incomesSheet.columns = [
    { header: 'Description', key: 'name', width: 30 },
    { header: 'USD', key: 'usd', width: 15 },
    { header: 'Date', key: 'date', width: 15 },
    { header: 'TRM', key: 'trm', width: 15 },
    { header: 'COP', key: 'cop', width: 20 },
  ];

  incomesSheet.getRow(1).eachCell(cell => {
    Object.assign(cell.style, headerStyle);
  });

  filteredEntries.forEach(entry => {
    incomesSheet.addRow({
      name: entry.name,
      usd: entry.usd,
      date: format(new Date(entry.date), APP_CONFIG.DATE_FORMAT.FULL_DATE),
      trm: entry.trm,
      cop: entry.cop,
    });
  });

  const incomeRowCount = incomesSheet.rowCount;
  const totalRow = incomesSheet.addRow({
    name: 'Total',
    usd: '',
    date: '',
    trm: '',
    cop: totalCOP,
  });

  totalRow.font = { bold: true };
  if (totalRow.getCell('name').alignment) {
    totalRow.getCell('name').alignment.horizontal = 'right';
  } else {
    totalRow.getCell('name').alignment = { horizontal: 'right' };
  }

  for (let i = 2; i <= incomeRowCount + 1; i++) {
    const row = incomesSheet.getRow(i);
    row.getCell('usd').numFmt = currencyFormat;
    row.getCell('trm').numFmt = currencyFormat;
    row.getCell('cop').numFmt = currencyFormat;
  }

  // =======================================================
  // Social Security Sheet
  // =======================================================

  socialSecuritySheet.mergeCells('A1:E1');
  socialSecuritySheet.getCell('A1').value = `Social Security Calculation - ${monthName}`;
  socialSecuritySheet.getCell('A1').font = { bold: true, size: 16 };
  socialSecuritySheet.getCell('A1').alignment = { horizontal: 'center' };

  socialSecuritySheet.addRow([]);
  socialSecuritySheet.addRow(['Total Income (COP)', totalCOP]);
  socialSecuritySheet.addRow(['Costos Percent', `${(costosPercent * 100).toFixed(2)}%`]);
  socialSecuritySheet.addRow(['Include Solidarity', includeSolidarity ? 'Yes' : 'No']);
  socialSecuritySheet.addRow([]);

  for (let i = 3; i <= 5; i++) {
    socialSecuritySheet.getRow(i).getCell(1).font = { bold: true };
    if (i === 3) {
      socialSecuritySheet.getRow(i).getCell(2).numFmt = currencyFormat;
    }
  }

  const { direct, presumption } = calculateBothMethods(totalCOP, costosPercent, includeSolidarity);

  const headerRow = socialSecuritySheet.addRow([
    'Calculation Type',
    'Direct Method',
    'Value',
    'Presumption Method',
    'Value',
  ]);

  headerRow.eachCell(cell => {
    Object.assign(cell.style, headerStyle);
  });

  // Base
  socialSecuritySheet.addRow([
    'Base',
    `${APP_CONFIG.FORMULA.BASE_PERCENTAGE * 100}% of Total Income`,
    direct.base,
    `${APP_CONFIG.FORMULA.BASE_PERCENTAGE * 100}% of Total Income after ${(costosPercent * 100).toFixed(2)}% costs`,
    presumption.base,
  ]);

  // Health
  socialSecuritySheet.addRow([
    `Health (${APP_CONFIG.FORMULA.HEALTH_PERCENTAGE * 100}%)`,
    '',
    direct.health,
    '',
    presumption.health,
  ]);

  // Pension
  socialSecuritySheet.addRow([
    `Pension (${APP_CONFIG.FORMULA.PENSION_PERCENTAGE * 100}%)`,
    '',
    direct.pension,
    '',
    presumption.pension,
  ]);

  // Solidarity (if included)
  if (includeSolidarity) {
    socialSecuritySheet.addRow([
      `Solidarity (${APP_CONFIG.FORMULA.SOLIDARITY_PERCENTAGE * 100}%)`,
      '',
      direct.solidarity,
      '',
      presumption.solidarity,
    ]);
  }

  // Add total rows with rounded values
  const totalCalcRow = socialSecuritySheet.addRow([
    'Total',
    '',
    direct.roundedTotal,
    '',
    presumption.roundedTotal,
  ]);

  totalCalcRow.font = { bold: true };

  const lastRowNum = socialSecuritySheet.rowCount;
  for (let i = 7; i <= lastRowNum; i++) {
    const row = socialSecuritySheet.getRow(i);
    row.getCell(1).font = { bold: true };
    row.getCell(3).numFmt = currencyFormat;
    row.getCell(5).numFmt = currencyFormat;
  }

  socialSecuritySheet.getColumn('A').width = 20;
  socialSecuritySheet.getColumn('B').width = 30;
  socialSecuritySheet.getColumn('C').width = 20;
  socialSecuritySheet.getColumn('D').width = 30;
  socialSecuritySheet.getColumn('E').width = 20;

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });

  const safeMonthName = monthName.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
  saveAs(blob, `Social_Security_${safeMonthName}.xlsx`);
};
