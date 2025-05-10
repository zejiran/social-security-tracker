import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { format } from 'date-fns';

/**
 * Exports income entries and social security calculations to Excel
 * 
 * @param {Array} incomeEntries - Array of income entries
 * @param {number} totalCOP - Total COP value
 * @param {number} costosPercent - Costos percentage (0-1)
 * @param {boolean} includeSolidarity - Whether to include solidarity
 * @param {string} monthName - Name of the month (e.g., "April 2025")
 * @returns {Promise<void>}
 */
export const exportToExcel = async (incomeEntries, totalCOP, costosPercent, includeSolidarity, monthName) => {
  // Create a new workbook and add two worksheets
  const workbook = new ExcelJS.Workbook();
  const incomesSheet = workbook.addWorksheet('Ingresos');
  const socialSecuritySheet = workbook.addWorksheet('Social Security');
  
  // Set up header styles
  const headerStyle = {
    font: { bold: true, color: { argb: 'FFFFFFFF' } },
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0066CC' } },
    alignment: { horizontal: 'center' }
  };
  
  // Set up the currency format
  const currencyFormat = '#,##0';
  
  // =======================================================
  // Ingresos Sheet
  // =======================================================
  
  // Set headers for the Ingresos sheet
  incomesSheet.columns = [
    { header: 'Description', key: 'name', width: 30 },
    { header: 'USD', key: 'usd', width: 15 },
    { header: 'Date', key: 'date', width: 15 },
    { header: 'TRM', key: 'trm', width: 15 },
    { header: 'COP', key: 'cop', width: 20 }
  ];
  
  // Apply header styles
  incomesSheet.getRow(1).eachCell((cell) => {
    cell.style = headerStyle;
  });
  
  // Add the income entries to the sheet
  incomeEntries.forEach(entry => {
    incomesSheet.addRow({
      name: entry.name,
      usd: entry.usd,
      date: entry.date instanceof Date 
        ? format(entry.date, 'yyyy-MM-dd')
        : entry.date,
      trm: entry.trm,
      cop: entry.cop
    });
  });
  
  // Add a total row
  const incomeRowCount = incomesSheet.rowCount;
  const totalRow = incomesSheet.addRow({
    name: 'Total',
    usd: '',
    date: '',
    trm: '',
    cop: totalCOP
  });
  
  // Format the total row
  totalRow.font = { bold: true };
  totalRow.getCell('name').alignment = { horizontal: 'right' };
  
  // Format currency columns
  for (let i = 2; i <= incomeRowCount + 1; i++) {
    const row = incomesSheet.getRow(i);
    row.getCell('usd').numFmt = currencyFormat;
    row.getCell('trm').numFmt = currencyFormat;
    row.getCell('cop').numFmt = currencyFormat;
  }
  
  // =======================================================
  // Social Security Sheet
  // =======================================================
  
  // Add title and income information
  socialSecuritySheet.mergeCells('A1:E1');
  socialSecuritySheet.getCell('A1').value = `Social Security Calculation - ${monthName}`;
  socialSecuritySheet.getCell('A1').font = { bold: true, size: 16 };
  socialSecuritySheet.getCell('A1').alignment = { horizontal: 'center' };
  
  socialSecuritySheet.addRow([]);
  socialSecuritySheet.addRow(['Total Income (COP)', totalCOP]);
  socialSecuritySheet.addRow(['Costos Percent', `${(costosPercent * 100).toFixed(2)}%`]);
  socialSecuritySheet.addRow(['Include Solidarity', includeSolidarity ? 'Yes' : 'No']);
  socialSecuritySheet.addRow([]);
  
  // Format the basic info cells
  for (let i = 3; i <= 5; i++) {
    socialSecuritySheet.getRow(i).getCell(1).font = { bold: true };
    if (i === 3) {
      socialSecuritySheet.getRow(i).getCell(2).numFmt = currencyFormat;
    }
  }
  
  // Calculate the bases
  const directBase = totalCOP * 0.4;
  const presuncionBase = totalCOP * (1 - costosPercent) * 0.4;
  
  // Add headers for calculation tables
  const headerRow = socialSecuritySheet.addRow([
    'Calculation Type', 
    'Direct Method', 
    'Value', 
    'Presumption Method', 
    'Value'
  ]);
  
  headerRow.eachCell((cell) => {
    cell.style = headerStyle;
  });
  
  // Add the calculation rows
  socialSecuritySheet.addRow([
    'Base', 
    '40% of Total Income', 
    directBase, 
    `40% of Total Income after ${(costosPercent * 100).toFixed(2)}% costs`, 
    presuncionBase
  ]);
  
  socialSecuritySheet.addRow([
    'Health (12.5%)', 
    '', 
    directBase * 0.125, 
    '', 
    presuncionBase * 0.125
  ]);
  
  socialSecuritySheet.addRow([
    'Pension (16%)', 
    '', 
    directBase * 0.16, 
    '', 
    presuncionBase * 0.16
  ]);
  
  if (includeSolidarity) {
    socialSecuritySheet.addRow([
      'Solidarity (1%)', 
      '', 
      directBase * 0.01, 
      '', 
      presuncionBase * 0.01
    ]);
  }
  
  // Calculate the totals
  const directTotal = directBase * 0.125 + directBase * 0.16 + (includeSolidarity ? directBase * 0.01 : 0);
  const presuncionTotal = presuncionBase * 0.125 + presuncionBase * 0.16 + (includeSolidarity ? presuncionBase * 0.01 : 0);
  
  // Round up to nearest 100
  const roundedDirectTotal = Math.ceil(directTotal / 100) * 100;
  const roundedPresuncionTotal = Math.ceil(presuncionTotal / 100) * 100;
  
  // Add total rows with rounded values
  const totalCalcRow = socialSecuritySheet.addRow([
    'Total', 
    '', 
    roundedDirectTotal, 
    '', 
    roundedPresuncionTotal
  ]);
  
  totalCalcRow.font = { bold: true };
  
  // Format the calculation table
  const lastRowNum = socialSecuritySheet.rowCount;
  for (let i = 7; i <= lastRowNum; i++) {
    const row = socialSecuritySheet.getRow(i);
    row.getCell(1).font = { bold: true };
    row.getCell(3).numFmt = currencyFormat;
    row.getCell(5).numFmt = currencyFormat;
  }
  
  // Set column widths
  socialSecuritySheet.getColumn('A').width = 20;
  socialSecuritySheet.getColumn('B').width = 30;
  socialSecuritySheet.getColumn('C').width = 20;
  socialSecuritySheet.getColumn('D').width = 30;
  socialSecuritySheet.getColumn('E').width = 20;
  
  // Generate the Excel file
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  
  // Save the file
  saveAs(blob, `Social_Security_${monthName.replace(' ', '_')}.xlsx`);
};