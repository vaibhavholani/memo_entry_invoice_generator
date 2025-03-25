import React from "react";
import { Card } from "./ui/card";
import { Separator } from "./ui/separator";
import { formatDateToDDMMYYYY, getTodayForDateInput } from "../utils/dateUtils";

// Extend Window interface to include our custom property
declare global {
  interface Window {
    _isRupeeSupported?: boolean;
  }
}

interface InvoiceItem {
  id: string;
  ddAmount?: number;
  billAmount: number;
  billNumber: string;
  partyName?: string;
  bankName?: string | string[];
  ddNo?: string | string[];
}

interface InvoiceTotals {
  gTotal: number;
  lessTotal: number;
  rd: number;
  gr: number;
  otherDifference: number;
  netTotal?: number;
  discount: number;
  rateDifference: number;
}

interface InvoicePreviewProps {
  items?: InvoiceItem[];
  totals?: InvoiceTotals;
  memoNumber?: string;
  supplierName?: string;
  date?: string;
  note?: string;
  lessDetails?: {
    grAmount?: string[];
    discount?: string[];
    otherDeduction?: string[];
    rateDifference?: string[];
  };
  partDetails?: Array<{
    memo_id: number;
    memo_number: number;
    amount: number;
  }>;
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
  rd: 0,
  gr: 0,
  otherDifference: 0,
  netTotal: 0,
  discount: 0,
  rateDifference: 0,
};


const InvoicePreview: React.FC<InvoicePreviewProps> = ({
  items = defaultItems,
  totals = defaultTotals,
  memoNumber = "MEM001",
  supplierName = "Sample Supplier",
  date = getTodayForDateInput(),
  note,
  lessDetails,
  partDetails,
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
  const totalBillAmount = items.reduce((sum, item) => sum + item.billAmount, 0);
  
  // Calculate net total if not provided
  const netTotal = totals.netTotal ?? (() => {
    return (
      totalBillAmount -
      totals.lessTotal
    );
  })();

  // Function to detect if rupee symbol is supported in the browser
  const isRupeeSymbolSupported = React.useCallback(() => {
    // Check if we've already determined support (using window object for caching)
    if (typeof window._isRupeeSupported !== 'undefined') {
      return window._isRupeeSupported;
    }
    
    try {
      // Create a temporary span element
      const span = document.createElement('span');
      span.style.visibility = 'hidden';
      span.style.position = 'absolute';
      span.style.fontSize = '16px';
      document.body.appendChild(span);
      
      // Test with a known supported character
      span.innerText = 'A';
      const controlWidth = span.offsetWidth;
      
      // Test with rupee symbol
      span.innerText = '₹';
      const rupeeWidth = span.offsetWidth;
      
      // Clean up
      document.body.removeChild(span);
      
      // If the widths are very different, the browser is likely using a fallback font
      const isSupported = Math.abs(rupeeWidth - controlWidth) < 5;
      
      // Cache the result
      window._isRupeeSupported = isSupported;
      return isSupported;
    } catch (e) {
      // If any error occurs, assume not supported
      window._isRupeeSupported = false;
      return false;
    }
  }, []);

  // Format currency in Indian format with rupee symbol or fallback
  const formatIndianCurrency = (amount: number): string => {
    const formattedAmount = amount.toLocaleString('en-IN', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2
    });
    
    return isRupeeSymbolSupported() 
      ? `₹ ${formattedAmount}` 
      : `Rs. ${formattedAmount}`;
  };

  // Generate rows with items that are already preprocessed in MemoEntryDetail
  const generateUniqueRows = () => {
    let rowIndex = 1;
    const rows: React.ReactNode[] = [];
    
    console.log("items in InvoicePreview");
    console.log(items);
    
    // Process each item
    items.forEach(item => {
      // Determine if this is a new party
      const currentPartyName = item.partyName || '';
      
      // Create a row for this item
      rows.push(
        <tr 
          key={`${rowIndex}`} 
          className={`border-b ${rowIndex % 2 === 0 ? 'bg-gray-50' : ''}`}
        >
          <td className="py-0 px-2">{rowIndex}</td>
          <td className="py-0 px-2">
            {item.ddAmount ? formatIndianCurrency(item.ddAmount) : ''}
          </td>
          <td className="py-0 px-2">
            {item.billAmount ? formatIndianCurrency(item.billAmount) : ''}
          </td>
          <td className="py-0 px-2">
            {`${item.billNumber}` === "-1" ? 'Part' : item.billNumber}
          </td>
          <td className="py-0 px-2">
            {currentPartyName || ''}
          </td>
          <td className="py-0 px-2">
            {item.bankName || ''}
          </td>
          <td className="py-0 px-2">
            {item.ddNo || ''}
          </td>
        </tr>
      );
      rowIndex++;
    });
    
    console.log("lessDetails in InvoicePreview");
    console.log(lessDetails);
    // Find the last row with bank name or DD number
    let lastBankOrDDRow = 0;
    for (let i = 0; i < items.length; i++) {
      if (items[i].bankName || items[i].ddNo) {
        lastBankOrDDRow = i + 1; // +1 because row indices start at 1
      }
    }
    
    // Add two empty rows as spacing
    for (let i = 0; i < 1; i++) {
      rows.push(
        <tr key={`empty-${i}`} className={`border-b ${rowIndex % 2 === 0 ? 'bg-gray-50' : ''}`}>
          <td className="py-0 px-2">{rowIndex}</td>
          <td className="py-0 px-2"></td>
          <td className="py-0 px-2"></td>
          <td className="py-0 px-2"></td>
          <td className="py-0 px-2"></td>
          <td className="py-0 px-2"></td>
          <td className="py-0 px-2"></td>
        </tr>
      );
      rowIndex++;
    }
    
    // Add less details rows
    if (lessDetails) {
      // Combine all less details arrays
      const allLessDetails = [
        ...(lessDetails.grAmount || []).map(detail => ({ type: 'G/R', detail })),
        ...(lessDetails.discount || []).map(detail => ({ type: 'Discount', detail })),
        ...(lessDetails.otherDeduction || []).map(detail => ({ type: 'Other', detail })),
        ...(lessDetails.rateDifference || []).map(detail => ({ type: 'R/D', detail }))
      ];
      
      console.log("allLessDetails in InvoicePreview");
      console.log(allLessDetails);
      // Add a header row for less details
      if (allLessDetails.length > 0) {
        rows.push(
          <tr key="less-header" className={`border-b font-semibold ${rowIndex % 2 === 0 ? 'bg-gray-50' : ''}`}>
            <td className="py-0 px-2">{rowIndex}</td>
            <td className="py-0 px-2"></td>
            <td className="py-0 px-2"></td>
            <td className="py-0 px-2"></td>
            <td className="py-0 px-2">Less Details:</td>
            <td className="py-0 px-2 text-right"></td>
            <td className="py-0 px-2 text-right"></td>
          </tr>
        );
        rowIndex++;
        
        // Add each less detail as a row
        allLessDetails.forEach((item, idx) => {
          rows.push(
            <tr key={`less-${idx}`} className={`border-b ${rowIndex % 2 === 0 ? 'bg-gray-50' : ''}`}>
              <td className="py-0 px-2">{rowIndex}</td>
              <td className="py-0 px-2"></td>
              <td className="py-0 px-2"></td>
              <td className="py-0 px-2"></td>
              <td className="py-0 px-2">{item.type}</td>
              <td className="py-0 px-2" colSpan={2}>{item.detail}</td>
            </tr>
          );
          rowIndex++;
        });
      }
    }
    
    // Add part details rows
    if (partDetails && partDetails.length > 0) {
      // Add a header row for part details
      rows.push(
        <tr key="part-header" className={`border-b font-semibold ${rowIndex % 2 === 0 ? 'bg-gray-50' : ''}`}>
          <td className="py-0 px-2">{rowIndex}</td>
          <td className="py-0 px-2"></td>
          <td className="py-0 px-2"></td>
          <td className="py-0 px-2"></td>
          <td className="py-0 px-2">Part Details:</td>
          <td className="py-0 px-2">Memo Number</td>
          <td className="py-0 px-2">Amount</td>
          <td className="py-0 px-2"></td>
        </tr>
      );
      rowIndex++;
      
      // Add each part detail as a row
      partDetails.forEach((part, idx) => {
        rows.push(
          <tr key={`part-${idx}`} className={`border-b ${rowIndex % 2 === 0 ? 'bg-gray-50' : ''}`}>
            <td className="py-0 px-2">{rowIndex}</td>
            <td className="py-0 px-2"></td>
            <td className="py-0 px-2"></td>
            <td className="py-0 px-2"></td>
            <td className="py-0 px-2"></td>
            <td className="py-0 px-2">{part.memo_number}</td>
            <td className="py-0 px-2">{formatIndianCurrency(part.amount)}</td>
            <td className="py-0 px-2"></td>
          </tr>
        );
        rowIndex++;
      });
    }
    
    console.log("rows in InvoicePreview");
    console.log(rows);
    
    return rows;
  };

  return (
    <Card
      id="invoice-preview"
      className="w-full max-w-[1000px] p-4 bg-white shadow-lg print-container"
    >
      <div className="space-y-4">
        <div className="flex justify-between border-b pb-2">
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

        <div className="space-y-2">
          <div className="overflow-visible">
            <table className="w-full text-xs border-collapse invoice-table">
              <thead className="sticky top-0 bg-white">
                <tr className="border-b">
                  <th className="text-left py-1 px-2 text-[10px]">#</th>
                  <th className="text-left py-1 px-2 text-[10px]">D/D Amount</th>
                  <th className="text-left py-1 px-2 text-[10px]">Bill Amount</th>
                  <th className="text-left py-1 px-2 text-[10px]">Bill Number</th>
                  <th className="text-left py-1 px-2 text-[10px]">Party's Name</th>
                  <th className="text-left py-1 px-2 text-[10px]">Bank Name</th>
                  <th className="text-left py-1 px-2 text-[10px]">D/D No.</th>
                </tr>
              </thead>
              <tbody className="text-[10px] leading-tight">
                {generateUniqueRows()}
              </tbody>
            </table>
          </div>
          
          <div className="mt-2">
            <table className="w-full text-[10px] leading-tight border-collapse">
              <tbody>
                <tr className="border-t-2 border-b border-black">
                  <td className="border px-2 py-0 w-[15%]"></td>
                  <td className="relative border px-2 py-0 w-[15%] text-right">
                  <div className="absolute left-0.5 top-0.5 text-[5px] leading-[7px] font-bold">
                      Bill Total
                    </div>
                    <div className="text-right">{formatIndianCurrency(totalBillAmount)}</div>
                    
                  </td>
                  <td className="border px-2 py-0 w-[15%] text-center" rowSpan={3}>
                    Discount<br/> {formatIndianCurrency(totals.discount)}
                  </td>
                  <td className="border px-2 py-0.5 w-[20%] text-center" rowSpan={3}>
                    R/D<br/> {formatIndianCurrency(totals.rd)}
                  </td>
                  <td className="border px-2 py-0.5 pt-1 w-[15%] text-center" rowSpan={3}>
                    G/R<br/>
                    {formatIndianCurrency(totals.gr)}
                  </td>
                  <td className="border px-2 py-0.5 text-center" rowSpan={3}>
                    Other Difference<br/>
                    {formatIndianCurrency(totals.otherDifference)}
                  </td>
                </tr>
                <tr className="border-black">
                  <td className="border px-2 py-0.5 text-right">
                  </td>
                  <td className="relative border px-2 py-0.5">
                  <div className="absolute left-0.5 top-0.5 text-[5px] leading-[7px] font-bold">
                      Less Total
                    </div>
                    <div className="text-right">{formatIndianCurrency(totals.lessTotal)}</div>
                  </td>

                </tr>
                <tr className="border-b-2 border-black">
                  <td className="relative border px-2 py-0.5 ">
                  <div className="absolute left-0.5 top-0.5 text-[5px] leading-[7px] font-bold">
                      DD. Amount
                    </div>
                    <div className="text-right">{formatIndianCurrency(totals.gTotal)}</div>
                 
                  </td>
                  <td className="relative border px-2 py-0.5t">
                    <div className="absolute left-0.5 top-0.5 text-[5px] leading-[7px] font-bold">
                      G. Total
                    </div>
                    <div className="text-right">{formatIndianCurrency(totals.gTotal)}</div>
                  </td>
                </tr>
              </tbody>
            </table>
            {/* <div className="text-right mt-2">
              <span className="font-semibold text-xs">
                Net Amount: {formatIndianCurrency(netTotal)}
              </span>
            </div> */}
            {note && (
              <div className="mt-2 border-t pt-2">
                <p className="text-xs">
                  <span className="font-semibold">Note:</span> {note}
                </p>
              </div>
            )}
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
