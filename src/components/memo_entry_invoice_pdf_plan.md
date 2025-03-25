Data Mapping Analysis: Invoice Preview Component
After analyzing both files, I can provide a comprehensive breakdown of how data is mapped to the UI in the invoice preview component. Let me walk through the data flow and UI structure in detail.

Data Flow Overview
Memo_invoice.tsx serves as a container component that:

Receives memoId and optional initialInvoiceData
Manages invoice data state
Passes this data to the InvoicePreview component
Handles actions (save, print, export to PDF)
InvoicePreview.tsx is the presentation component that:

Receives data through props
Formats and processes this data
Renders the complete invoice UI with all elements
Data Structure
The invoice data follows this structure:

interface InvoiceFormData {
  memoNumber: string;
  supplierName: string;
  date: string;
  items: InvoiceItem[];
  lessDetails: {
    gr_amount: string[];
    discount: string[];
    other_deduction: string[];
    rate_difference: string[];
  };
  partDetails: Array<{
    memo_id: number;
    memo_number: number;
    amount: number;
  }>;
  totals: {
    gTotal: number;
    lessTotal: number;
    discount: number;
    rd: number;
    gr: number;
    otherDifference: number;
    netTotal: number;
    rateDifference: number;
  };
  note?: string;
}
UI Structure & Data Mapping
1. Header Section
+------------------------------------------+------------------+
| Global Holani Tradelink                  | Memo Number: xxx |
| 1128, 1st and 2nd floor, Kucha natwan... | Supplier: xxx    |
| Delhi - 110006                           |                  |
+------------------------------------------+------------------+
Data Mapping:

Company info: Hardcoded in the component (Left Aligned)

(Right Aligned)
Memo Number: invoiceData.memoNumber
Supplier: invoiceData.supplierName
2. Main Invoice Table
+---+------------+-------------+------------+-------------+------------+--------+
| # | D/D Amount | Bill Amount | Bill Number| Party's Name| Bank Name  | D/D No.|
+---+------------+-------------+------------+-------------+------------+--------+
| 1 | ₹ 1,000.00 | ₹ 1,200.00  | BILL001    | Sample Party| Sample Bank| DD001  |
+---+------------+-------------+------------+-------------+------------+--------+
Data Mapping:

Each row is generated from invoiceData.items array
Row number: Generated incrementally in the generateUniqueRows() function
D/D Amount: item.ddAmount formatted as Indian currency
Bill Amount: item.billAmount formatted as Indian currency
Bill Number: item.billNumber (shows "Part" if value is "-1")
Party's Name: item.partyName
Bank Name: item.bankName
D/D No.: item.ddNo
3. Less Details Section (Conditional)
+---+------------+-------------+------------+-------------+------------+--------+
| n |            |             |            | Less Details|            |        |
+---+------------+-------------+------------+-------------+------------+--------+
| n+1|           |             |            | G/R         | Detail text (col span 2) |
+---+------------+-------------+------------+-------------+------------+--------+
Data Mapping:

Only appears if lessDetails has values
Combines all less details arrays into a single display:
G/R: lessDetails.grAmount
Discount: lessDetails.discount
Other: lessDetails.otherDeduction
R/D: lessDetails.rateDifference
Each detail gets its own row with type label and detail text
4. Part Details Section (Conditional)
+---+------------+-------------+------------+-------------+------------+--------+
| n |            |             |            | Part Details| Memo Number| Amount |
+---+------------+-------------+------------+-------------+------------+--------+
| n+1|           |             |            |             | 123        | ₹ 500  |
+---+------------+-------------+------------+-------------+------------+--------+
Data Mapping:

Only appears if partDetails has values
Each part detail gets its own row showing:
Memo Number: part.memo_number
Amount: part.amount formatted as Indian currency
5. Summary Table
 below DD Amount | Bill Amount    | ...
+----------------+----------------+----------------+----------------+----------------+----------------+
|                | Bill Total     | Discount       | R/D            | G/R            | Other Difference|
|                | ₹ 1,200.00     |                |                |                |                |
|                |                | ₹ 0.00         | ₹ 0.00         | ₹ 0.00         | ₹ 0.00         |
+----------------+----------------+                |                |                |                |
|                | Less Total     |                |                |                |                |
|                | ₹ 0.00         |                |                |                |                |
+----------------+----------------+                |                |                |                |
| DD. Amount     | G. Total       |                |                |                |                |
| ₹ 1,000.00     | ₹ 1,000.00     |                |                |                |                |
+----------------+----------------+----------------+----------------+----------------+----------------+

Bill Total: Calculated as sum of all item.billAmount values
Less Total: totals.lessTotal
DD. Amount: totals.gTotal
G. Total: totals.gTotal
Discount: totals.discount
R/D: totals.rd
G/R: totals.gr
Other Difference: totals.otherDifference


6. Footer Section
Received Date: _________________    Signature: _________________
Receiver's Signature: _____________    Date: DD/MM/YYYY
Data Mapping:

Date: invoiceData.date formatted to DD/MM/YYYY using formatDateToDDMMYYYY
Other fields: Static placeholders for manual completion
Special UI Features & Formatting
Row Alternating Colors:

Even rows get a light gray background (bg-gray-50)
Currency Formatting:

All monetary values are formatted using formatIndianCurrency function
Shows values in Indian Rupee format (₹ with thousands separator)
Date Formatting:

Dates are converted to DD/MM/YYYY format using formatDateToDDMMYYYY
Conditional Rendering:

Less Details section only appears if there are values
Part Details section only appears if there are values
Note section only appears if a note is provided
Table Cell Styling:

Small text size (text-[10px])
Compact padding (py-0 px-2)
Border styling for separation
PDF Export Customizations:

When exporting to PDF, additional styling is applied:
Table borders are enhanced
Text positioning is adjusted
Column widths are calculated proportionally
Border and Row Span Details
Main Invoice Table:

Standard borders between rows
No column spans
Summary Table:

Complex border and row span structure:
"Discount", "R/D", "G/R", and "Other Difference" cells use rowSpan={3}

Less Details and Part Details:

"Less Details" and "Part Details" headers span multiple columns
Detail rows maintain consistent border styling
