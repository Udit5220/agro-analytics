import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generateInvoicePdf = (invoice) => {
  const doc = new jsPDF();
  const dateStr = new Date(invoice.invoiceDate).toLocaleDateString('en-IN');
  
  // Header section
  doc.setFontSize(22);
  doc.setTextColor(19, 42, 19); // brand-darkest roughly
  doc.text('AgroIndia.', 14, 22);
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text('Precision algorithms for global soil optimization.', 14, 28);
  
  // Invoice title
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text('INVOICE', 140, 22);
  
  doc.setFontSize(10);
  doc.text(`Invoice #: ${invoice.invoiceNumber}`, 140, 28);
  doc.text(`Date: ${dateStr}`, 140, 34);
  doc.text(`Status: ${invoice.paymentStatus.toUpperCase()}`, 140, 40);

  // Bill To & From
  doc.setFontSize(12);
  doc.text('Bill To:', 14, 45);
  doc.setFontSize(10);
  doc.setTextColor(80, 80, 80);
  doc.text(invoice.buyerName || 'Buyer', 14, 52);

  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text('From:', 100, 45);
  doc.setFontSize(10);
  doc.setTextColor(80, 80, 80);
  doc.text(invoice.sellerName || 'Seller', 100, 52);

  // Table
  const tableData = [
    [
      invoice.commodity,
      `${invoice.quantity} ${invoice.unit}`,
      `Rs. ${invoice.amount?.toLocaleString()}`,
      `${invoice.taxRate}%`,
      `Rs. ${invoice.totalAmount?.toLocaleString()}`
    ]
  ];

  autoTable(doc, {
    startY: 65,
    head: [['Commodity', 'Quantity', 'Amount', 'Tax Rate', 'Total']],
    body: tableData,
    theme: 'striped',
    headStyles: { fillColor: [49, 87, 44] }, // brand-dark
    styles: { fontSize: 10, cellPadding: 4 },
  });

  // Footer / Totals
  const finalY = doc.lastAutoTable.finalY + 10;
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  doc.text(`Subtotal: Rs. ${invoice.amount?.toLocaleString()}`, 140, finalY);
  doc.text(`Tax Amount: Rs. ${invoice.taxAmount?.toLocaleString()}`, 140, finalY + 7);
  doc.setFontSize(13);
  doc.text(`Total Paid: Rs. ${invoice.totalAmount?.toLocaleString()}`, 140, finalY + 16);

  // Disclaimer
  doc.setFontSize(9);
  doc.setTextColor(150, 150, 150);
  doc.text('Thank you for trading on the AgroIndia Marketplace.', 14, finalY + 30);

  // Download
  doc.save(`AgroIndia_Invoice_${invoice.invoiceNumber}.pdf`);
};
