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
