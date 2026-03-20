import React from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { exportToCsv } from "@/utils/exportCsv";

interface ExportButtonProps {
  data: Record<string, any>[];
  columns: { key: string; label: string }[];
  filename: string;
  label?: string;
}

const ExportButton: React.FC<ExportButtonProps> = ({ data, columns, filename, label = "Exporter CSV" }) => {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => exportToCsv(filename, data, columns)}
      disabled={data.length === 0}
      className="flex items-center gap-2"
    >
      <Download className="h-4 w-4" />
      {label}
    </Button>
  );
};

export default ExportButton;
