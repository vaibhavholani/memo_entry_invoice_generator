import { jsPDF } from "jspdf";
import { formatDateToDDMMYYYY } from "../../dateUtils";

interface SignaturesProps {
  pdf: jsPDF;
  margin: number;
  pageWidth: number;
  pageHeight: number;
  date: string;
}

export const drawSignatures = ({
  pdf,
  margin,
  pageWidth,
  pageHeight,
  date,
}: SignaturesProps) => {
  const signatureY = pageHeight - margin - 25;
  const lineWidth = 50;
  const formattedDate = date.includes('/') ? date : formatDateToDDMMYYYY(date);

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);

  // Draw lines for signatures
  pdf.line(margin, signatureY, margin + lineWidth, signatureY);
  pdf.line(margin, signatureY + 15, margin + lineWidth, signatureY + 15);
  pdf.line(pageWidth - margin - lineWidth, signatureY, pageWidth - margin, signatureY);


  // Add labels
  pdf.text("Received Date", margin, signatureY - 3);
  pdf.text("Receiver's Signature", margin, signatureY + 12);
  pdf.text("Signature", pageWidth - margin - lineWidth, signatureY - 3);
  pdf.text("Date", pageWidth - margin - lineWidth, signatureY + 12);
  pdf.text(formattedDate, pageWidth - margin - lineWidth + 15, signatureY + 12);
};
