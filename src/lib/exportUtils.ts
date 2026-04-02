import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Extend jsPDF with autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export const exportToCSV = (filename: string, data: any[][]) => {
  const csvContent = "data:text/csv;charset=utf-8," 
    + data.map(e => e.join(",")).join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToPDF = (title: string, filename: string, headers: string[], rows: any[][]) => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(18);
  doc.text(title, 14, 22);
  
  // Add date
  doc.setFontSize(11);
  doc.setTextColor(100);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
  
  // Add table
  doc.autoTable({
    startY: 40,
    head: [headers],
    body: rows,
    theme: 'striped',
    headStyles: { fillColor: [103, 80, 164] }, // Primary color #6750A4
    styles: { fontSize: 9 },
  });
  
  doc.save(`${filename}.pdf`);
};
