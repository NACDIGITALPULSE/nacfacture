export function exportToCsv(filename: string, rows: Record<string, any>[], columns: { key: string; label: string }[]) {
  const header = columns.map((c) => c.label).join(",");
  const csvRows = rows.map((row) =>
    columns
      .map((c) => {
        const val = row[c.key];
        const str = val == null ? "" : String(val);
        // Escape quotes and wrap in quotes if contains comma/newline/quote
        if (str.includes(",") || str.includes("\n") || str.includes('"')) {
          return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
      })
      .join(",")
  );
  const csv = [header, ...csvRows].join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
