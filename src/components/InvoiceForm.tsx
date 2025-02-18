import React from "react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import InvoiceItemsTable from "./InvoiceItemsTable";
import { Button } from "./ui/button";

interface InvoiceFormData {
  memoNumber: string;
  supplierName: string;
  items: Array<{
    id: string;
    ddAmount: number;
    billAmount: number;
    billNumber: string;
    partyName: string;
    bankName: string;
    ddNo: string;
  }>;
  totals: {
    gTotal: number;
    lessTotal: number;
    discountPercentage: number;
    rd: number;
    gr: number;
    otherDifference: number;
  };
}

interface InvoiceFormProps {
  initialData?: InvoiceFormData;
  onSubmit?: (data: InvoiceFormData) => void;
}

const defaultFormData: InvoiceFormData = {
  memoNumber: "MEM001",
  supplierName: "Sample Supplier",
  items: [
    {
      id: "1",
      ddAmount: 1000,
      billAmount: 1200,
      billNumber: "BILL001",
      partyName: "Sample Party",
      bankName: "Sample Bank",
      ddNo: "DD001",
    },
  ],
  totals: {
    gTotal: 0,
    lessTotal: 0,
    discountPercentage: 0,
    rd: 0,
    gr: 0,
    otherDifference: 0,
  },
};

const InvoiceForm: React.FC<InvoiceFormProps> = ({
  initialData = defaultFormData,
  onSubmit = () => {},
}) => {
  const [formData, setFormData] = React.useState<InvoiceFormData>(initialData);

  const handleTotalsChange = (
    field: keyof InvoiceFormData["totals"],
    value: number,
  ) => {
    setFormData((prev) => ({
      ...prev,
      totals: {
        ...prev.totals,
        [field]: value,
      },
    }));
  };

  const handleInputChange = (field: keyof InvoiceFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleItemsChange = (items: InvoiceFormData["items"]) => {
    setFormData((prev) => ({
      ...prev,
      items,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto p-6 bg-white">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="space-y-2">
            <Label htmlFor="memoNumber">Memo Number</Label>
            <Input
              id="memoNumber"
              value={formData.memoNumber}
              onChange={(e) => handleInputChange("memoNumber", e.target.value)}
              placeholder="Enter Memo Number"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="supplierName">Supplier Name</Label>
            <Input
              id="supplierName"
              value={formData.supplierName}
              onChange={(e) =>
                handleInputChange("supplierName", e.target.value)
              }
              placeholder="Enter Supplier Name"
            />
          </div>
        </div>

        <div className="space-y-4">
          <Label>Invoice Items</Label>
          <InvoiceItemsTable
            items={formData.items}
            onItemsChange={handleItemsChange}
          />
        </div>

        <div className="space-y-4 border-t pt-4 mt-4">
          <Label>Totals & Adjustments</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="gTotal">G. Total</Label>
              <Input
                id="gTotal"
                type="number"
                value={formData.totals.gTotal}
                onChange={(e) =>
                  handleTotalsChange("gTotal", parseFloat(e.target.value) || 0)
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lessTotal">Less Total</Label>
              <Input
                id="lessTotal"
                type="number"
                value={formData.totals.lessTotal}
                onChange={(e) =>
                  handleTotalsChange(
                    "lessTotal",
                    parseFloat(e.target.value) || 0,
                  )
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="discountPercentage">Dis %</Label>
              <Input
                id="discountPercentage"
                type="number"
                value={formData.totals.discountPercentage}
                onChange={(e) =>
                  handleTotalsChange(
                    "discountPercentage",
                    parseFloat(e.target.value) || 0,
                  )
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rd">RD</Label>
              <Input
                id="rd"
                type="number"
                value={formData.totals.rd}
                onChange={(e) =>
                  handleTotalsChange("rd", parseFloat(e.target.value) || 0)
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gr">G/R</Label>
              <Input
                id="gr"
                type="number"
                value={formData.totals.gr}
                onChange={(e) =>
                  handleTotalsChange("gr", parseFloat(e.target.value) || 0)
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="otherDifference">Other Difference</Label>
              <Input
                id="otherDifference"
                type="number"
                value={formData.totals.otherDifference}
                onChange={(e) =>
                  handleTotalsChange(
                    "otherDifference",
                    parseFloat(e.target.value) || 0,
                  )
                }
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => setFormData(defaultFormData)}
          >
            Reset
          </Button>
          <Button type="submit">Generate Invoice</Button>
        </div>
      </form>
    </Card>
  );
};

export default InvoiceForm;
