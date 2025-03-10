import { jsPDF } from "jspdf";

interface TableItem {
  id: string;
  ddAmount: number;
  billAmount: number;
  billNumber: string;
  partyName: string;
  bankName: string;
  ddNo: string;
}

interface TableProps {
  pdf: jsPDF;
  margin: number;
  pageWidth: number;
  startY: number;
  items: TableItem[];
  pageHeight: number;
}

const drawCell = (
  pdf: jsPDF,
  text: string,
  x: number,
  y: number,
  w: number,
  h: number,
  align: string = 'left',
  fill: boolean = false
) => {
  if (fill) {
    pdf.setFillColor(240, 240, 240);
    pdf.rect(x, y, w, h, 'F');
  }
  pdf.rect(x, y, w, h);
  pdf.text(
    text,
    align === 'right' ? x + w - 2 : x + 2,
    y + h/2 + 1,
    { align: align === 'right' ? 'right' : 'left', baseline: 'middle' }
  );
};

export const drawTable = ({
  pdf,
  margin,
  pageWidth,
  startY,
  items,
  pageHeight,
}: TableProps) => {
  const usableWidth = pageWidth - 2 * margin;
  const headers = ["#", "D/D Amount", "Bill Amount", "Bill Number", "Party's Name", "Bank Name", "D/D No."];
  const colWidths = [10, 30, 30, 35, 45, 45, 35];
  let y = startY;
  let rowHeight = 8;
  let pageNo = 1;

  // Draw table header row
  let x = margin;
  pdf.setFillColor(240, 240, 240);
  pdf.rect(x, y, usableWidth, rowHeight, 'F');
  
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(9);
  headers.forEach((header, i) => {
    drawCell(
      pdf,
      header,
      x,
      y,
      colWidths[i],
      rowHeight,
      header.includes('Amount') ? 'right' : 'left',
      true
    );
    x += colWidths[i];
  });

  // Draw table rows
  pdf.setFont("helvetica", "normal");
  y += rowHeight;

  items.forEach((item, index) => {
    if (y > pageHeight - 60) {
      pdf.addPage();
      pageNo++;
      y = margin + 10;
      
      // Redraw headers on new page
      x = margin;
      pdf.setFont("helvetica", "bold");
      headers.forEach((header, i) => {
        drawCell(
          pdf,
          header,
          x,
          y,
          colWidths[i],
          rowHeight,
          header.includes('Amount') ? 'right' : 'left',
          true
        );
        x += colWidths[i];
      });
      pdf.setFont("helvetica", "normal");
      y += rowHeight;
    }

    x = margin;
    const row = [
      (index + 1).toString(),
      item.ddAmount.toFixed(2),
      item.billAmount.toFixed(2),
      item.billNumber,
      item.partyName,
      item.bankName,
      item.ddNo,
    ];

    row.forEach((cell, i) => {
      drawCell(
        pdf,
        cell,
        x,
        y,
        colWidths[i],
        rowHeight,
        i === 1 || i === 2 ? 'right' : 'left'
      );
      x += colWidths[i];
    });
    y += rowHeight;
  });

  return { endY: y, colWidths, pageNo };
};
