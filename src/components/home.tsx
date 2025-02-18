import React from "react";
import jspdf from "jspdf";
import html2canvas from "html2canvas";
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

  const handleExport = async () => {
    const previewElement = document.getElementById("invoice-preview");
    if (!previewElement) return;

    try {
      const canvas = await html2canvas(previewElement, {
        scale: 2,
        backgroundColor: "#ffffff",
      });

      const pdf = new jspdf.jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`invoice-${invoiceData.memoNumber}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <ActionBar
        onSave={handleSave}
        onPrint={handlePrint}
        onExport={handleExport}
      />

      <div className="container mx-auto py-6 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
