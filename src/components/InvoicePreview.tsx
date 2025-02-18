import React from "react";
import { Card } from "./ui/card";
import { Separator } from "./ui/separator";

interface InvoiceItem {
  id: string;
  ddAmount: number;
  billAmount: number;
  billNumber: string;
  partyName: string;
  bankName: string;
  ddNo: string;
}

interface InvoiceTotals {
  gTotal: number;
  lessTotal: number;
  discountPercentage: number;
  rd: number;
  gr: number;
  otherDifference: number;
}

interface InvoicePreviewProps {
  items?: InvoiceItem[];
  totals?: InvoiceTotals;
  memoNumber?: string;
  supplierName?: string;
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
];

const defaultTotals: InvoiceTotals = {
  gTotal: 0,
  lessTotal: 0,
  discountPercentage: 0,
  rd: 0,
  gr: 0,
  otherDifference: 0,
};

const InvoicePreview: React.FC<InvoicePreviewProps> = ({
  items = defaultItems,
  totals = defaultTotals,
  memoNumber = "MEM001",
  supplierName = "Sample Supplier",
}) => {
  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + item.billAmount, 0);
  };

  const calculateNetTotal = () => {
    const total = calculateTotal();
    const discountAmount = total * (totals.discountPercentage / 100);
    return (
      total -
      totals.lessTotal -
      discountAmount -
      totals.rd -
      totals.gr -
      totals.otherDifference
    );
  };

  return (
    <Card
      id="invoice-preview"
      className="w-full max-w-[600px] p-8 bg-white shadow-lg"
    >
      <div className="space-y-6">
        <div className="flex justify-between border-b pb-4">
          <div>
            <h1 className="text-2xl font-bold">Global Holani Tradelink</h1>
            <p className="text-sm text-gray-600">
              1128, 1st and 2nd floor, Kucha natwan, Chandni Chowk
            </p>
            <p className="text-sm text-gray-600">Delhi - 110006</p>
          </div>
          <div className="text-right">
            <p className="font-semibold">Memo Number: {memoNumber}</p>
            <p className="text-sm text-gray-600">Supplier: {supplierName}</p>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">D/D Amount</th>
                <th className="text-left py-2">Bill Amount</th>
                <th className="text-left py-2">Bill Number</th>
                <th className="text-left py-2">Party's Name</th>
                <th className="text-left py-2">Bank Name</th>
                <th className="text-left py-2">D/D No.</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="py-2">{item.ddAmount}</td>
                  <td className="py-2">{item.billAmount}</td>
                  <td className="py-2">{item.billNumber}</td>
                  <td className="py-2">{item.partyName}</td>
                  <td className="py-2">{item.bankName}</td>
                  <td className="py-2">{item.ddNo}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-6 border-t pt-4 space-y-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p>
                  <span className="font-semibold">G. Total:</span> ₹
                  {calculateTotal().toFixed(2)}
                </p>
                <p>
                  <span className="font-semibold">Less Total:</span> ₹
                  {totals.lessTotal}
                </p>
                <p>
                  <span className="font-semibold">Dis %:</span>{" "}
                  {totals.discountPercentage}%
                </p>
              </div>
              <div>
                <p>
                  <span className="font-semibold">RD:</span> ₹{totals.rd}
                </p>
                <p>
                  <span className="font-semibold">G/R:</span> ₹{totals.gr}
                </p>
                <p>
                  <span className="font-semibold">Other Difference:</span> ₹
                  {totals.otherDifference}
                </p>
              </div>
            </div>
            <div className="border-t pt-2 mt-2">
              <p className="text-right font-bold">
                Net Amount: ₹{calculateNetTotal().toFixed(2)}
              </p>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between">
              <span className="font-semibold">Total Amount:</span>
              <span>{calculateTotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Net Total:</span>
              <span>{calculateNetTotal().toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 pt-6 border-t">
          <div>
            <p className="text-sm mb-2">Received Date: _________________</p>
            <p className="text-sm">Receiver's Signature: _________________</p>
          </div>
          <div className="text-right">
            <p className="text-sm mb-2">Signature: _________________</p>
            <p className="text-sm">Date: _________________</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default InvoicePreview;
