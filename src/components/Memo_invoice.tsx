import React from "react";
import html2canvas from "html2canvas";
import ActionBar from "./ActionBar";
import InvoicePreview from "./InvoicePreview";
import { getTodayForDateInput } from "../utils/dateUtils";
import { jsPDF } from "jspdf";

// Import the InvoiceFormData interface from InvoiceForm
import type { InvoiceFormData } from "./InvoiceForm";

// Use the imported interface
interface MemoInvoiceGeneratorProps {
  memoId: number;
  initialInvoiceData?: InvoiceFormData;
}

const defaultInvoiceData: InvoiceFormData = {
  memoNumber: "MEM001",
  supplierName: "Sample Supplier",
  date: getTodayForDateInput(),   
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
  lessDetails: {
    gr_amount: [],
    discount: [],
    other_deduction: [],
    rate_difference: []
  },
  partDetails: [],
  totals: {
    gTotal: 0,
    lessTotal: 0,
    discount: 0,
    rd: 0,
    gr: 0,
    otherDifference: 0,
    netTotal: 0,
    rateDifference: 0,
  },
};

export function MemoInvoiceGenerator({ memoId, initialInvoiceData }: MemoInvoiceGeneratorProps) {
  const [invoiceData, setInvoiceData] = React.useState<InvoiceFormData>(initialInvoiceData || defaultInvoiceData);

  // Update invoiceData when initialInvoiceData changes
  React.useEffect(() => {
    if (initialInvoiceData) {
      setInvoiceData(initialInvoiceData);
    }
  }, [initialInvoiceData]);

  const handleSave = () => {
    console.log("Saving invoice...", invoiceData);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExport = async () => {
    try {
      // Show loading indicator
      const loadingEl = document.createElement('div');
      loadingEl.innerText = 'Generating PDF...';
      loadingEl.style.position = 'fixed';
      loadingEl.style.top = '50%';
      loadingEl.style.left = '50%';
      loadingEl.style.transform = 'translate(-50%, -50%)';
      loadingEl.style.background = 'white';
      loadingEl.style.padding = '20px';
      loadingEl.style.boxShadow = '0 0 10px rgba(0,0,0,0.2)';
      loadingEl.style.zIndex = '9999';
      document.body.appendChild(loadingEl);
      
      // Get the invoice preview element
      const invoicePreview = document.getElementById('invoice-preview');
      
      if (!invoicePreview) {
        throw new Error("Could not find invoice preview element");
      }
      
      // Create container for PDF generation
      const container = document.createElement('div');
      container.style.position = 'fixed';
      container.style.left = '-9999px';
      container.style.top = '0';
      container.style.width = '210mm';
      container.style.backgroundColor = 'white';
      document.body.appendChild(container);
      
      // Clone the Card component
      const clone = invoicePreview.cloneNode(true) as HTMLElement;
      clone.style.width = '100%';
      clone.style.margin = '0 auto';
      clone.style.backgroundColor = 'white';
      clone.style.border = 'none';
      
      // Append to container
      container.appendChild(clone);
      
      // Apply thin horizontal row lines only to the main table
      const mainTable = clone.querySelector('.invoice-table') as HTMLTableElement;
      if (mainTable) {
        // Add a visible border to the entire table
        // mainTable.style.border = '0.5px solid #000';
        mainTable.style.borderCollapse = 'collapse';
        mainTable.style.width = '100%';
        // mainTable.style.marginBottom = '8px';
        
        // Convert fixed widths to percentages
        const colWidths = [10, 30, 30, 30, 50, 45, 35];
        const totalWidth = colWidths.reduce((sum, width) => sum + width, 0);
        const colPercentages = colWidths.map(width => (width / totalWidth * 100).toFixed(2) + '%');
        
        // Get all rows in the table
        const rows = mainTable.querySelectorAll('tr');
        
        // Process each row and its cells
        rows.forEach((row, rowIndex) => {
          // // Thin horizontal lines with increased visibility
          // row.style.borderBottom = '0.5px solid #000';
          // // Increased row height for better readability
          row.style.height = '20px';

          // Shift the text to a little up by shifting absolute position of the text
          const cells = row.querySelectorAll('td');
          cells.forEach(cell => {
            const cellElement = cell as HTMLElement;
            cellElement.style.position = 'relative';
            cellElement.style.top = '-5px';
            cellElement.style.fontSize = '10px';
            
          });
          
        });
        
        // Set column widths to match the provided percentages
        const headerCells = mainTable.querySelectorAll('th');
        if (headerCells.length >= 7) {
          headerCells.forEach((cell, index) => {
            if (index < colPercentages.length) {
              (cell as HTMLElement).style.width = colPercentages[index];
            }
          });
        }
      }
      
      // Fix summary tables to match the image with specific border requirements
      const summaryTables = clone.querySelectorAll('.mt-2 table');
      // Add a black border on top and bottom of the summary table
      summaryTables.forEach(table => {
        // Basic table styling
        // (table as HTMLElement).style.borderCollapse = 'collapse';
        // (table as HTMLElement).style.width = '100%';
        
        // // Add visible borders to match the main table
        // (table as HTMLElement).style.border = '0.5px solid #000';
        // (table as HTMLElement).style.borderTop = '1px solid #000';
        // (table as HTMLElement).style.borderBottom = '1px solid #000';
        
        // Get all rows
        const summaryRows = table.querySelectorAll('tr');
        
        // First, establish consistent column borders throughout the table
        // This ensures we have the same vertical lines for the entire table
        // const firstRow = table.querySelector('tr');
        // if (firstRow) {
        //   const cells = firstRow.querySelectorAll('td');
        //   const totalCells = cells.length;
          
        //   // Calculate the positions where column borders should appear
        //   const borderPositions = [];
        //   let cumulativeWidth = 0;
          
        //   cells.forEach((cell, index) => {
        //     const isLastThreeColumns = index >= 2;
        //     if (!isLastThreeColumns && index < totalCells - 1) {
        //       // Add a border position after this cell
        //       const cellWidth = (cell as HTMLElement).offsetWidth || 0;
        //       cumulativeWidth += cellWidth;
        //       borderPositions.push(cumulativeWidth);
        //     }
        //   });
        // }
        
        // Process each row
        summaryRows.forEach((row, rowIndex) => {
          // Remove row border completely - we'll handle borders at the cell level
          row.style.height = '20px'; // Increased height for summary rows
          
         // shift the text to a little up by shifting absolute position of the text
         const cells = row.querySelectorAll('td');
         cells.forEach(cell => {
          const cellElement = cell as HTMLElement;
          cellElement.style.position = 'relative';
          cellElement.style.top = '-10px';
          cellElement.style.fontSize = '10px';

          console.log("cellElement in MemoInvoiceGenerator");
          console.log(cellElement);

          // select only the text inside the cells
          const text = cellElement.querySelector('div');

          if (text) {
            text.style.position = 'absolute';
            text.style.top = '-2px';
          }

          const bottomText: HTMLDivElement | null = cellElement.querySelector('.text-right');
          if (bottomText) {
            bottomText.style.position = 'absolute';
            bottomText.style.top = '-0.5px';
            bottomText.style.right = '5px';
          }
          // cellElement.style.border = 'none';
          if (rowIndex === 0) {
            cellElement.style.borderTop = 'solid 2px black';
          }
          
          
         });
         // for row index 0, remove bottom border

         row.style.border = 'none';
         if (rowIndex === summaryRows.length - 1) {
         
         row.style.borderBottom = 'solid 2px black';
         }
         if (rowIndex === 0) {
           row.style.borderBottom = 'none';
           row.style.borderTop = 'none';
         }



         // shift this element 
          
        }


      );
      });
      
      // Fix the top border of the Net Amount line which comes after the summary table
      // const netAmountEl = clone.querySelector('.text-right.mt-2');
      // if (netAmountEl) {
      //   (netAmountEl as HTMLElement).style.marginTop = '10px';
      //   (netAmountEl as HTMLElement).style.borderTop = 'none';
        
      //   // Increase font size of Net Amount text
      //   const netAmountText = netAmountEl.querySelector('.font-semibold.text-xs');
      //   if (netAmountText) {
      //     (netAmountText as HTMLElement).style.fontSize = '12px';
      //     (netAmountText as HTMLElement).style.fontWeight = 'bold';
      //   }
      // }
      
      // Improve the note section styling
      const noteSection = clone.querySelector('.mt-2.border-t.pt-2');
      if (noteSection) {
        (noteSection as HTMLElement).style.marginTop = '15px';
        (noteSection as HTMLElement).style.paddingTop = '10px';
        (noteSection as HTMLElement).style.borderTop = '0.5px solid #aaa';
        
        // Increase font size of the note text
        const noteText = noteSection.querySelector('p.text-xs');
        if (noteText) {
          (noteText as HTMLElement).style.fontSize = '11px';
          (noteText as HTMLElement).style.lineHeight = '1.4';
        }
      }
      
      // Improve the signature section styling
      const signatureSection = clone.querySelector('.grid.grid-cols-2');
      if (signatureSection) {
        const signatureTexts = signatureSection.querySelectorAll('p.text-xs');
        signatureTexts.forEach(text => {
          (text as HTMLElement).style.fontSize = '11px';
          (text as HTMLElement).style.marginBottom = '8px';
        });
      }
      
      // Wait to ensure rendering completes
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Generate PDF with optimized quality settings for smaller file size
      const canvas = await html2canvas(clone, {
        scale: 3, // Reduced from 2 to 1.2 for better balance of quality and file size
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false
        // letterRendering option is not available in the current html2canvas type definitions
      });
      
      // Compress the image with quality parameter (0.7 provides good balance between quality and size)
      const imgData = canvas.toDataURL('image/png', 0.7);
      
      // Create PDF with proper sizing and compression
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true // Enable PDF compression
      });
      
      // Calculate dimensions to fit A4
      const pdfWidth = pdf.internal.pageSize.getWidth() - 20;
      const pdfHeight = pdf.internal.pageSize.getHeight() - 20;
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      
      // Center the image
      const xPos = 10 + (pdfWidth - imgWidth * ratio) / 2;
      
      // Add image to PDF
      pdf.addImage(
        imgData, 
        'PNG', 
        xPos, 
        10, 
        imgWidth * ratio, 
        imgHeight * ratio
      );
      
      // Clean up
      // document.body.removeChild(container);
      document.body.removeChild(loadingEl);
      
      // Save the PDF
      pdf.save(`invoice-${invoiceData.memoNumber}.pdf`);
    } catch (error) {
      console.error("PDF export failed:", error);
      alert("Failed to export PDF. Please try again.");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <ActionBar
        onSave={handleSave}
        onPrint={handlePrint}
        onExport={handleExport}
      />

      <div className="p-6">
        <div className="grid grid-cols-1 gap-8 max-w-4xl mx-auto">
          <div className="space-y-6">
            
            <InvoicePreview
              items={invoiceData.items}
              totals={invoiceData.totals}
              memoNumber={invoiceData.memoNumber}
              supplierName={invoiceData.supplierName}
              date={invoiceData.date}
              note={invoiceData.note}
              lessDetails={invoiceData.lessDetails}
              partDetails={invoiceData.partDetails}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
