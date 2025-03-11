import { jsPDF } from "jspdf";

interface HeaderProps {
  pdf: jsPDF;
  margin: number;
  pageWidth: number;
  memoNumber: string;
  supplierName: string;
  date: string;
}

export const drawHeader = ({
  pdf,
  margin,
  pageWidth,
  memoNumber,
  supplierName,
  date,
}: HeaderProps) => {
  const headerHeight = 25;
  const usableWidth = pageWidth - 2 * margin;

  // Draw header box
  pdf.rect(margin, margin, usableWidth, headerHeight);
  
  // Company details (left side)
  pdf.setFontSize(16);
  pdf.setFont("helvetica", "bold");
  pdf.text("Global Holani Tradelink", margin + 5, margin + 8);
  
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  pdf.text("1128, 1st and 2nd floor, Kucha natwan, Chandni Chowk", margin + 5, margin + 15);
  pdf.text("Delhi - 110006", margin + 5, margin + 22);

  // Memo details (right side)
  pdf.setFontSize(9);
  pdf.text(`Memo Number: ${memoNumber}`, pageWidth - margin - 60, margin + 8);
  pdf.text(`Supplier: ${supplierName}`, pageWidth - margin - 60, margin + 15);

  return margin + headerHeight + 10; // Return the Y position for next section
};
