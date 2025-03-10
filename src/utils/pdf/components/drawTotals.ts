import { jsPDF } from "jspdf";
import { calculateTotalDDAmount, calculateTotalBillAmount } from "../../calculations";

interface TotalsProps {
  pdf: jsPDF;
  margin: number;
  startY: number;
  colWidths: number[];
  items: Array<{ ddAmount: number; billAmount: number }>;
  totals: {
    lessTotal: number;
    gTotal: number;
    discountPercentage: number;
    rd: number;
    gr: number;
    otherDifference: number;
  };
}

const drawCell = (
  pdf: jsPDF,
  text: string,
  x: number,
  y: number,
  w: number,
  h: number,
  align: string = 'right'
) => {
  pdf.rect(x, y, w, h);
  pdf.text(
    text,
    align === 'right' ? x + w - 2 : x + 2,
    y + h/2 + 1,
    { align: align === 'right' ? 'right' : 'left', baseline: 'middle' }
  );
};

export const drawTotals = ({
  pdf,
  margin,
  startY,
  colWidths,
  items,
  totals,
}: TotalsProps) => {
  let y = startY + 5;
  const rowHeight = 6;
  let x = margin;

  // Draw double line at top
  pdf.setLineWidth(0.5);
  pdf.line(margin, y, margin + colWidths.reduce((a, b) => a + b, 0), y);
  pdf.line(margin, y + 0.5, margin + colWidths.reduce((a, b) => a + b, 0), y + 0.5);
  pdf.setLineWidth(0.2);

  y += 1;

  // First row
  // Empty cell for D/D Amount
  drawCell(pdf, "", x, y, colWidths[0], rowHeight);
  x += colWidths[0];

  // Total Bill Amount
  drawCell(pdf, calculateTotalBillAmount(items).toFixed(2), x, y, colWidths[1], rowHeight);
  x += colWidths[1];

  // Less Total
  drawCell(pdf, totals.lessTotal.toFixed(2), x, y, colWidths[2], rowHeight);
  x += colWidths[2];

  // Draw cells that span both rows
  const spanningCells = [
    { text: `${totals.discountPercentage}%\n${totals.rd.toFixed(2)}`, width: colWidths[3] },
    { text: totals.gr.toFixed(2), width: colWidths[4] },
    { text: totals.otherDifference.toFixed(2), width: colWidths[5] }
  ];

  spanningCells.forEach(cell => {
    drawCell(pdf, cell.text, x, y, cell.width, rowHeight * 2);
    x += cell.width;
  });

  // Second row
  y += rowHeight;
  x = margin;

  // Total D/D Amount
  drawCell(pdf, calculateTotalDDAmount(items).toFixed(2), x, y, colWidths[0], rowHeight);
  x += colWidths[0];

  // Empty cell under Total Bill Amount
  drawCell(pdf, "", x, y, colWidths[1], rowHeight);
  x += colWidths[1];

  // G. Total
  drawCell(pdf, totals.gTotal.toFixed(2), x, y, colWidths[2], rowHeight);

  // Draw double line at bottom
  y += rowHeight;
  pdf.setLineWidth(0.5);
  pdf.line(margin, y, margin + colWidths.reduce((a, b) => a + b, 0), y);
  pdf.line(margin, y + 0.5, margin + colWidths.reduce((a, b) => a + b, 0), y + 0.5);
  pdf.setLineWidth(0.2);

  return y + 5;
};
