import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Plus, Trash2 } from "lucide-react";

interface InvoiceItem {
  id: string;
  ddAmount: number;
  billAmount: number;
  billNumber: string;
  partyName: string;
  bankName: string;
  ddNo: string;
}

interface InvoiceItemsTableProps {
  items?: InvoiceItem[];
  onItemsChange?: (items: InvoiceItem[]) => void;
}

const defaultItems: InvoiceItem[] = [
  {
    id: "1",
    ddAmount: 1000,
    billAmount: 1200,
    billNumber: "BILL001",
    partyName: "Sample Party",
    bankName: "Sample Bank",
    ddNo: "DD001",
  },
  {
    id: "2",
    ddAmount: 2000,
    billAmount: 2400,
    billNumber: "BILL002",
    partyName: "Another Party",
    bankName: "Another Bank",
    ddNo: "DD002",
  },
];

const InvoiceItemsTable: React.FC<InvoiceItemsTableProps> = ({
  items = defaultItems,
  onItemsChange = () => {},
}) => {
  const addNewRow = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      ddAmount: 0,
      billAmount: 0,
      billNumber: "",
      partyName: "",
      bankName: "",
      ddNo: "",
    };
    onItemsChange([...items, newItem]);
  };

  const deleteRow = (id: string) => {
    onItemsChange(items.filter((item) => item.id !== id));
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: number) => {
    onItemsChange(
      items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    );
  };

  return (
    <div className="w-full bg-white p-4 rounded-lg border border-gray-200">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>D/D Amount</TableHead>
            <TableHead>Bill Amount</TableHead>
            <TableHead>Bill Number</TableHead>
            <TableHead>Party's Name</TableHead>
            <TableHead>Bank Name</TableHead>
            <TableHead>D/D No.</TableHead>
            <TableHead className="w-[50px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <Input
                  type="number"
                  value={item.ddAmount}
                  onChange={(e) =>
                    updateItem(
                      item.id,
                      "ddAmount",
                      parseFloat(e.target.value) || 0,
                    )
                  }
                  className="w-full"
                />
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  value={item.billAmount}
                  onChange={(e) =>
                    updateItem(
                      item.id,
                      "billAmount",
                      parseFloat(e.target.value) || 0,
                    )
                  }
                  className="w-full"
                />
              </TableCell>
              <TableCell>
                <Input
                  value={item.billNumber}
                  onChange={(e) =>
                    updateItem(item.id, "billNumber", e.target.value)
                  }
                  className="w-full"
                />
              </TableCell>
              <TableCell>
                <Input
                  value={item.partyName}
                  onChange={(e) =>
                    updateItem(item.id, "partyName", e.target.value)
                  }
                  className="w-full"
                />
              </TableCell>
              <TableCell>
                <Input
                  value={item.bankName}
                  onChange={(e) =>
                    updateItem(item.id, "bankName", e.target.value)
                  }
                  className="w-full"
                />
              </TableCell>
              <TableCell>
                <Input
                  value={item.ddNo}
                  onChange={(e) => updateItem(item.id, "ddNo", e.target.value)}
                  className="w-full"
                />
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteRow(item.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="mt-4 flex justify-end">
        <Button onClick={addNewRow} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Row
        </Button>
      </div>
    </div>
  );
};

export default InvoiceItemsTable;
