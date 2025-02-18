import React from "react";
import { Button } from "./ui/button";
import { Printer, Save, FileDown } from "lucide-react";

interface ActionBarProps {
  onSave?: () => void;
  onPrint?: () => void;
  onExport?: () => void;
}

const ActionBar: React.FC<ActionBarProps> = ({
  onSave = () => {},
  onPrint = () => {},
  onExport = () => {},
}) => {
  return (
    <div className="w-full h-16 bg-white border-b border-gray-200 px-4 flex items-center justify-between">
      <div className="text-lg font-semibold text-gray-900">
        Invoice Generator
      </div>
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={onSave}
        >
          <Save className="h-4 w-4" />
          Save
        </Button>
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={onPrint}
        >
          <Printer className="h-4 w-4" />
          Print
        </Button>
        <Button
          variant="default"
          className="flex items-center gap-2"
          onClick={onExport}
        >
          <FileDown className="h-4 w-4" />
          Export PDF
        </Button>
      </div>
    </div>
  );
};

export default ActionBar;
