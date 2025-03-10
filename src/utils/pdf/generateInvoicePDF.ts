import { jsPDF } from "jspdf";
import { drawHeader } from "./components/drawHeader";
import { drawTable } from "./components/drawTable";
import { drawTotals } from "./components/drawTotals";
import { drawSignatures } from "./components/drawSignatures";
import { calculateNetTotal } from "../calculations";

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

export const generateInvoicePDF = (invoiceData: InvoiceData) => {
  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  // Page dimensions
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 15;

  // Draw header and get next Y position
  let currentY = drawHeader({
    pdf,
    margin,
    pageWidth,
    memoNumber: invoiceData.memoNumber,
    supplierName: invoiceData.supplierName,
  });

  // Draw table and get table info
  const { endY, colWidths, pageNo } = drawTable({
    pdf,
    margin,
    pageWidth,
    startY: currentY,
    items: invoiceData.items,
    pageHeight,
  });

  // Draw totals section
  currentY = drawTotals({
    pdf,
    margin,
    startY: endY,
    colWidths,
    items: invoiceData.items,
    totals: invoiceData.totals,
  });

  // Add net amount
  const netTotal = calculateNetTotal(invoiceData.items, invoiceData.totals);
  pdf.setFont("helvetica", "bold");
  pdf.text(
    `Net Amount: ${netTotal.toFixed(2)}`,
    pageWidth - margin,
    currentY,
    { align: 'right' }
  );

  // Draw signatures
  drawSignatures({
    pdf,
    margin,
    pageWidth,
    pageHeight,
  });

  // Add page numbers if multiple pages
  if (pageNo > 1) {
    for (let i = 1; i <= pageNo; i++) {
      pdf.setPage(i);
      pdf.setFontSize(8);
      pdf.setFont("helvetica", "normal");
      pdf.text(
        `Page ${i} of ${pageNo}`,
        pageWidth - margin,
        pageHeight - margin,
        { align: 'right' }
      );
    }
  }

  return pdf;
};
