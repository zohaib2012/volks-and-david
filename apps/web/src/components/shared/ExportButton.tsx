import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ExportColumn {
  key: string;
  label: string;
}

interface ExportButtonProps<T> {
  data: T[];
  filename?: string;
  columns: ExportColumn[];
}

function convertToCSV<T>(data: T[], columns: ExportColumn[]): string {
  const header = columns.map((c) => `"${c.label}"`).join(",");
  const rows = data.map((item) =>
    columns
      .map((c) => {
        const val = (item as Record<string, unknown>)[c.key];
        const str = val == null ? "" : String(val);
        return `"${str.replace(/"/g, '""')}"`;
      })
      .join(","),
  );
  return [header, ...rows].join("\n");
}

function triggerDownload(csv: string, filename: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function ExportButton<T>({ data, filename = "export.csv", columns }: ExportButtonProps<T>) {
  const handleExport = () => {
    const csv = convertToCSV(data, columns);
    triggerDownload(csv, filename);
  };

  return (
    <Button variant="outline" size="sm" onClick={handleExport} disabled={data.length === 0}>
      <Download className="h-4 w-4 mr-1.5" />
      Export CSV
    </Button>
  );
}
