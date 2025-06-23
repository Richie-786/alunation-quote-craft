
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { CustomerDetails, QuotationItem } from '@/types/quotation';

export const exportToExcel = (
  customerDetails: CustomerDetails,
  items: QuotationItem[],
  subtotal: number,
  tax: number,
  total: number,
  transportationCost?: number
) => {
  // Create a new workbook
  const wb = XLSX.utils.book_new();

  // Customer details sheet
  const customerData = [
    ['Customer Details', ''],
    ['Project Name', customerDetails.projectName],
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
    ['SL No.', 'Name', 'Description', 'Height', 'Width', 'Area (Sq.ft)', 'Quantity', 'Price/Sq.ft (₹)', 'Total Cost (₹)', 'Note'],
    ...items.map(item => [
      item.slNo,
      item.name,
      item.description || '',
      item.height,
      item.width,
      item.area,
      item.quantity,
      item.pricePerSqft,
      item.totalCost,
      item.note || ''
    ]),
    ['', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', 'Subtotal:', subtotal],
    ['', '', '', '', '', '', '', '', 'GST (18%):', tax],
    ...(transportationCost && transportationCost > 0 ? [['', '', '', '', '', '', '', '', 'Transportation:', transportationCost]] : []),
    ['', '', '', '', '', '', '', '', 'Total Amount:', total]
  ];

  // Create worksheets
  const customerWs = XLSX.utils.aoa_to_sheet(customerData);
  const quotationWs = XLSX.utils.aoa_to_sheet(quotationData);

  // Add worksheets to workbook
  XLSX.utils.book_append_sheet(wb, customerWs, 'Customer Details');
  XLSX.utils.book_append_sheet(wb, quotationWs, 'Quotation');

  // Generate filename with current date
  const filename = `Quotation_${customerDetails.projectName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`;

  // Write file
  XLSX.writeFile(wb, filename);
};

export const exportToPDF = (
  customerDetails: CustomerDetails,
  items: QuotationItem[],
  subtotal: number,
  tax: number,
  total: number,
  transportationCost?: number
) => {
  const doc = new jsPDF();

  // HEADER SECTION - Centered with company details
  doc.setFillColor(59, 130, 246); // Blue background
  doc.rect(0, 0, 210, 50, 'F');
  
  doc.setTextColor(255, 255, 255); // White text
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('V & V ALUNATION', 105, 20, { align: 'center' });
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('15/A Chakranagar Main Road, Valmiki Nagar 10th Main 3rd Cross', 105, 30, { align: 'center' });
  doc.text('Andrahalli, Bangalore - 560091', 105, 36, { align: 'center' });
  doc.text('GSTIN NO: 29DVMPS1625D1ZC', 105, 42, { align: 'center' });

  // Divider line
  doc.setDrawColor(59, 130, 246);
  doc.setLineWidth(1);
  doc.line(20, 60, 190, 60);

  // CUSTOMER DETAILS SECTION
  doc.setTextColor(0, 0, 0); // Black text
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('PROJECT QUOTATION', 20, 75);

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Customer Details:', 20, 90);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Project Name: ${customerDetails.projectName}`, 20, 100);
  doc.text(`Customer Name: ${customerDetails.name}`, 20, 107);
  doc.text(`GST Number: ${customerDetails.gstNumber}`, 20, 114);
  doc.text(`Address: ${customerDetails.address}`, 20, 121);
  doc.text(`Phone: ${customerDetails.phone}`, 20, 128);
  doc.text(`Email: ${customerDetails.email}`, 20, 135);

  // QUOTATION TABLE SECTION
  const tableData = items.map(item => [
    item.slNo.toString(),
    item.name,
    item.description || '',
    item.height.toFixed(2),
    item.width.toFixed(2),
    item.area.toFixed(2),
    item.quantity.toString(),
    `₹${item.pricePerSqft.toFixed(2)}`,
    `₹${item.totalCost.toFixed(2)}`,
    item.note || ''
  ]);

  (doc as any).autoTable({
    head: [['SL', 'Name', 'Description', 'Height', 'Width', 'Area (Sq.ft)', 'Qty', 'Price/Sq.ft', 'Total Cost', 'Note']],
    body: tableData,
    startY: 150,
    styles: { 
      fontSize: 8,
      cellPadding: 3
    },
    headStyles: { 
      fillColor: [59, 130, 246],
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    },
    alternateRowStyles: {
      fillColor: [245, 247, 250]
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 15 },
      1: { cellWidth: 25 },
      2: { cellWidth: 30 },
      3: { halign: 'center', cellWidth: 18 },
      4: { halign: 'center', cellWidth: 18 },
      5: { halign: 'center', cellWidth: 20 },
      6: { halign: 'center', cellWidth: 15 },
      7: { halign: 'right', cellWidth: 25 },
      8: { halign: 'right', cellWidth: 25 },
      9: { cellWidth: 25 }
    }
  });

  // SUMMARY SECTION
  const finalY = (doc as any).lastAutoTable.finalY + 20;
  
  // Summary box with colored background
  doc.setFillColor(245, 247, 250);
  doc.rect(120, finalY - 5, 70, transportationCost && transportationCost > 0 ? 35 : 30, 'F');
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Subtotal: ₹${subtotal.toFixed(2)}`, 125, finalY + 5);
  doc.text(`GST (18%): ₹${tax.toFixed(2)}`, 125, finalY + 12);
  
  let totalY = finalY + 19;
  if (transportationCost && transportationCost > 0) {
    doc.text(`Transportation: ₹${transportationCost.toFixed(2)}`, 125, totalY);
    totalY += 7;
  }
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(59, 130, 246);
  doc.text(`Total Amount: ₹${total.toFixed(2)}`, 125, totalY);

  // Generate filename
  const filename = `Quotation_${customerDetails.projectName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;

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
          projectName: customerData[1]?.[1] || '',
          name: customerData[2]?.[1] || '',
          gstNumber: customerData[3]?.[1] || '',
          address: customerData[4]?.[1] || '',
          phone: customerData[5]?.[1] || '',
          email: customerData[6]?.[1] || ''
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
            totalCost: Number(row[8]) || 0,
            note: row[9] || ''
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
