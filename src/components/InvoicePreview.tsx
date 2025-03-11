import React from "react";
import { Card } from "./ui/card";
import { Separator } from "./ui/separator";
import { formatDateToDDMMYYYY, getTodayForDateInput } from "../utils/dateUtils";

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
  netTotal?: number;
}

interface InvoicePreviewProps {
  items?: InvoiceItem[];
  totals?: InvoiceTotals;
  memoNumber?: string;
  supplierName?: string;
  date?: string;
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
  netTotal: 0,
};

const InvoicePreview: React.FC<InvoicePreviewProps> = ({
  items = defaultItems,
  totals = defaultTotals,
  memoNumber = "MEM001",
  supplierName = "Sample Supplier",
  date = getTodayForDateInput(),
}) => {
  // Format the date to DD/MM/YYYY for display
  const formattedDate = React.useMemo(() => {
    // Check if the date is already in DD/MM/YYYY format
    if (date.includes('/')) {
      return date;
    }
    return formatDateToDDMMYYYY(date);
  }, [date]);

  // Calculate totals
  const totalDDAmount = items.reduce((sum, item) => sum + item.ddAmount, 0);
  const totalBillAmount = items.reduce((sum, item) => sum + item.billAmount, 0);
  
  // Calculate net total if not provided
  const netTotal = totals.netTotal ?? (() => {
    const discountAmount = totalBillAmount * (totals.discountPercentage / 100);
    return (
      totalBillAmount -
      totals.lessTotal -
      discountAmount -
      totals.rd -
      totals.gr -
      totals.otherDifference
    );
  })();

  // Format currency in Indian
  const formatIndianCurrency = (amount: number): string => {
    return amount.toLocaleString('en-IN', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2
    });
  };

  return (
    <Card
      id="invoice-preview"
      className="w-full max-w-[1000px] p-6 bg-white shadow-lg"
    >
      <div className="space-y-6">
        <div className="flex justify-between border-b pb-4">
          <div>
            <h1 className="text-xl font-bold">Global Holani Tradelink</h1>
            <p className="text-xs text-gray-600">
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
          <div className="max-h-[400px] overflow-auto">
            <table className="w-full text-xs border-collapse">
              <thead className="sticky top-0 bg-white">
                <tr className="border-b">
                  <th className="text-left py-2 px-2 w-[5%]">#</th>
                  <th className="text-left py-2 px-2 w-[12%]">D/D Amount</th>
                  <th className="text-left py-2 px-2 w-[12%]">Bill Amount</th>
                  <th className="text-left py-2 px-2 w-[15%]">Bill Number</th>
                  <th className="text-left py-2 px-2 w-[20%]">Party's Name</th>
                  <th className="text-left py-2 px-2 w-[20%]">Bank Name</th>
                  <th className="text-left py-2 px-2 w-[16%]">D/D No.</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr 
                    key={item.id} 
                    className={`border-b ${index % 2 === 0 ? 'bg-gray-50' : ''}`}
                  >
                    <td className="py-2 px-2">{index + 1}</td>
                    <td className="py-2 px-2">{item.ddAmount > 0 ? formatIndianCurrency(item.ddAmount) : ''}</td>
                    <td className="py-2 px-2">{formatIndianCurrency(item.billAmount)}</td>
                    <td className="py-2 px-2">{item.billNumber}</td>
                    <td className="py-2 px-2">{item.partyName}</td>
                    <td className="py-2 px-2">{item.bankName}</td>
                    <td className="py-2 px-2">{item.ddNo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-4">
            <table className="w-full text-xs border-collapse">
              <tbody>
                <tr className="border-t-2 border-b border-black">
                  <td className="border px-2 py-0.5 w-[15%]"></td>
                  <td className="border px-2 py-0.5 w-[15%] text-right">
                    {formatIndianCurrency(totalBillAmount)}
                  </td>
                  <td className="border px-2 py-0.5 w-[15%] relative" style={{ minHeight: "30px" }}>
                    <div className="absolute bottom-0.5 left-0.5 text-[8px] font-bold">Less Total</div>
                    <div className="text-right">{formatIndianCurrency(totals.lessTotal)}</div>
                  </td>
                  <td className="border px-2 py-0.5 w-[20%] text-center" rowSpan={2}>
                    Dis. {totals.discountPercentage}%<br/>
                    R/D {formatIndianCurrency(totals.rd)}
                  </td>
                  <td className="border px-2 py-0.5 w-[15%] text-center" rowSpan={2}>
                    G/R<br/>
                    {formatIndianCurrency(totals.gr)}
                  </td>
                  <td className="border px-2 py-0.5 text-center" rowSpan={2}>
                    Other Difference<br/>
                    {formatIndianCurrency(totals.otherDifference)}
                  </td>
                </tr>
                <tr className="border-b-2 border-black">
                  <td className="border px-2 py-0.5 text-right">
                    {totalDDAmount > 0 ? formatIndianCurrency(totalDDAmount) : ''}
                  </td>
                  <td className="border px-2 py-0.5"></td>
                  <td className="border px-2 py-0.5 relative" style={{ minHeight: "30px" }}>
                    <div className="absolute bottom-0.5 left-0.5 text-[8px] font-bold">G. Total</div>
                    <div className="text-right">{formatIndianCurrency(totals.gTotal)}</div>
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="text-right mt-2">
              <span className="font-semibold text-xs">
                Net Amount: {formatIndianCurrency(netTotal)}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 pt-4 border-t mt-4">
          <div>
            <p className="text-xs mb-4">Received Date: _________________</p>
            <p className="text-xs">Receiver's Signature: _________________</p>
          </div>
          <div className="text-right">
            <p className="text-xs mb-4">Signature: _________________</p>
            <p className="text-xs">Date: {formattedDate}</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default InvoicePreview;
