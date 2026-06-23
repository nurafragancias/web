import * as XLSX from 'xlsx';

export const exportXlsx = (filename, sheets) => {
  const wb = XLSX.utils.book_new();
  for (const { name, rows } of sheets) {
    const ws = XLSX.utils.json_to_sheet(rows.length ? rows : [{ 'Sin datos': '—' }]);
    const cols = rows.length ? Object.keys(rows[0]) : ['Sin datos'];
    ws['!cols'] = cols.map(h => {
      const maxLen = rows.reduce((m, r) => Math.max(m, String(r[h] ?? '').length), String(h).length);
      return { wch: Math.min(Math.max(maxLen + 2, 10), 40) };
    });
    XLSX.utils.book_append_sheet(wb, ws, String(name).slice(0, 31));
  }
  XLSX.writeFile(wb, filename);
};

export const todayStamp = () => new Date().toISOString().slice(0, 10).replace(/-/g, '');

// Lee un archivo .xlsx/.csv y devuelve las filas de la primera hoja como
// objetos { header: valor }. Las celdas vacías quedan como ''.
export const readWorkbookRows = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const wb = XLSX.read(e.target.result, { type: 'array' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(ws, { defval: '' });
        resolve(rows);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(reader.error || new Error('No se pudo leer el archivo'));
    reader.readAsArrayBuffer(file);
  });
