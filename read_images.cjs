const XLSX = require('xlsx');
const path = require('path');

const filePath = 'C:\\Users\\Mirko Ponce\\Desktop\\imagenes.xlsx';

try {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

  // Show first 20 rows to understand structure
  for (let i = 0; i < Math.min(data.length, 20); i++) {
    console.log(`Row ${i}: A="${data[i][0]}" | B="${data[i][1]}"`);
  }
  console.log(`\nTotal rows: ${data.length}`);
} catch (error) {
  console.error('Error:', error.message);
}
