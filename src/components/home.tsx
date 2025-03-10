import React from "react";
import { generateInvoicePDF } from "../utils/pdf/generateInvoicePDF";
import ActionBar from "./ActionBar";
import InvoiceForm from "./InvoiceForm";
import InvoicePreview from "./InvoicePreview";

interface InvoiceData {
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
    netTotal?: number;
  };
}

const defaultInvoiceData: InvoiceData = {
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
    netTotal: 0,
  },
};

export default function Home() {
  const [invoiceData, setInvoiceData] =
    React.useState<InvoiceData>(defaultInvoiceData);

  const handleFormSubmit = (data: InvoiceData) => {
    setInvoiceData(data);
  };

  const handleSave = () => {
    console.log("Saving invoice...", invoiceData);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    const pdf = generateInvoicePDF(invoiceData);
    pdf.save(`invoice-${invoiceData.memoNumber}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <ActionBar
        onSave={handleSave}
        onPrint={handlePrint}
        onExport={handleExport}
      />

      <div className="container mx-auto py-6 px-4">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Invoice Details
            </h2>
            <InvoiceForm
              initialData={invoiceData}
              onSubmit={handleFormSubmit}
            />
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Preview</h2>
            <InvoicePreview
              items={invoiceData.items}
              totals={invoiceData.totals}
              memoNumber={invoiceData.memoNumber}
              supplierName={invoiceData.supplierName}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
