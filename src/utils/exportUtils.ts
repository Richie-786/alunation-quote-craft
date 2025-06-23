
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { CustomerDetails, QuotationItem } from '@/types/quotation';

export const exportToExcel = (
  customerDetails: CustomerDetails,
  items: QuotationItem[],
  subtotal: number,
  tax: number,
  total: number
) => {
  // Create a new workbook
  const wb = XLSX.utils.book_new();

  // Customer details sheet
  const customerData = [
    ['Customer Details', ''],
    ['Name', customerDetails.name],
    ['GST Number', customerDetails.gstNumber],
    ['Address', customerDetails.address],
    ['Phone', customerDetails.phone],
    ['Email', customerDetails.email],
    ['', ''],
    ['Generated On', new Date().toLocaleDateString()]
  ];

  // Quotation items data
  const quotationData = [
    ['SL No.', 'Name', 'Description', 'Height', 'Width', 'Area (Sq.ft)', 'Quantity', 'Price/Sq.ft (₹)', 'Total Cost (₹)'],
    ...items.map(item => [
      item.slNo,
      item.name,
      item.description || '',
      item.height,
      item.width,
      item.area,
      item.quantity,
      item.pricePerSqft,
      item.totalCost
    ]),
    ['', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', 'Subtotal:', subtotal],
    ['', '', '', '', '', '', '', 'GST (18%):', tax],
    ['', '', '', '', '', '', '', 'Total Amount:', total]
  ];

  // Create worksheets
  const customerWs = XLSX.utils.aoa_to_sheet(customerData);
  const quotationWs = XLSX.utils.aoa_to_sheet(quotationData);

  // Add worksheets to workbook
  XLSX.utils.book_append_sheet(wb, customerWs, 'Customer Details');
  XLSX.utils.book_append_sheet(wb, quotationWs, 'Quotation');

  // Generate filename with current date
  const filename = `Quotation_${customerDetails.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`;

  // Write file
  XLSX.writeFile(wb, filename);
};

export const exportToPDF = (
  customerDetails: CustomerDetails,
  items: QuotationItem[],
  subtotal: number,
  tax: number,
  total: number
) => {
  const doc = new jsPDF();

  // Header
  doc.setFontSize(20);
  doc.text('V&V Alunation', 20, 20);
  doc.setFontSize(12);
  doc.text('Window Manufacturing & Quotation System', 20, 30);
  doc.text('Bangalore, India', 20, 40);

  // Customer details
  doc.setFontSize(14);
  doc.text('Customer Details:', 20, 60);
  doc.setFontSize(10);
  doc.text(`Name: ${customerDetails.name}`, 20, 70);
  doc.text(`GST Number: ${customerDetails.gstNumber}`, 20, 80);
  doc.text(`Address: ${customerDetails.address}`, 20, 90);
  doc.text(`Phone: ${customerDetails.phone}`, 20, 100);
  doc.text(`Email: ${customerDetails.email}`, 20, 110);

  // Quotation table
  const tableData = items.map(item => [
    item.slNo.toString(),
    item.name,
    item.description || '',
    item.height.toFixed(2),
    item.width.toFixed(2),
    item.area.toFixed(2),
    item.quantity.toString(),
    `₹${item.pricePerSqft.toFixed(2)}`,
    `₹${item.totalCost.toFixed(2)}`
  ]);

  autoTable(doc, {
    head: [['SL No.', 'Name', 'Description', 'Height', 'Width', 'Area (Sq.ft)', 'Qty', 'Price/Sq.ft', 'Total Cost']],
    body: tableData,
    startY: 130,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [59, 130, 246] }
  });

  // Summary
  const finalY = (doc as any).lastAutoTable.finalY + 20;
  doc.setFontSize(12);
  doc.text(`Subtotal: ₹${subtotal.toFixed(2)}`, 130, finalY);
  doc.text(`GST (18%): ₹${tax.toFixed(2)}`, 130, finalY + 10);
  doc.setFontSize(14);
  doc.text(`Total Amount: ₹${total.toFixed(2)}`, 130, finalY + 25);

  // Generate filename
  const filename = `Quotation_${customerDetails.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;

  // Save PDF
  doc.save(filename);
};

export const importFromExcel = (file: File): Promise<{
  customerDetails: CustomerDetails;
  items: QuotationItem[];
}> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });

        // Read customer details
        const customerSheet = workbook.Sheets['Customer Details'];
        const customerData = XLSX.utils.sheet_to_json(customerSheet, { header: 1 }) as any[][];
        
        const customerDetails: CustomerDetails = {
          name: customerData[1]?.[1] || '',
          gstNumber: customerData[2]?.[1] || '',
          address: customerData[3]?.[1] || '',
          phone: customerData[4]?.[1] || '',
          email: customerData[5]?.[1] || ''
        };

        // Read quotation items
        const quotationSheet = workbook.Sheets['Quotation'];
        const quotationData = XLSX.utils.sheet_to_json(quotationSheet, { header: 1 }) as any[][];
        
        // Skip header row and filter out empty/summary rows
        const items: QuotationItem[] = quotationData
          .slice(1)
          .filter(row => row[0] && typeof row[0] === 'number')
          .map((row, index) => ({
            slNo: index + 1,
            name: row[1] || '',
            description: row[2] || '',
            height: Number(row[3]) || 0,
            width: Number(row[4]) || 0,
            area: Number(row[5]) || 0,
            quantity: Number(row[6]) || 1,
            pricePerSqft: Number(row[7]) || 0,
            totalCost: Number(row[8]) || 0
          }));

        resolve({ customerDetails, items });
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
};
