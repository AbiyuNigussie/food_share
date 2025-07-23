import { generatePdf } from "html-pdf-node";
import Handlebars from "handlebars";
import fs from "fs";
import path from "path";

interface ReceiptData {
  full_name: string;
  plan: string;
  amount: string;
  currency: string;
  date: string;
  transaction_id: string;
}

export const generateReceiptPDF = async (data: ReceiptData): Promise<Buffer> => {
  // Load and compile template
  const templatePath = path.join(__dirname, "..", "templates", "receipt.hbs");
  const templateSource = fs.readFileSync(templatePath, "utf-8");
  const template = Handlebars.compile(templateSource);
  
  // Generate HTML from template
  const html = template(data);
  
  // PDF options
  const options = { 
    format: "A4",
    margin: { top: "20mm", right: "20mm", bottom: "20mm", left: "20mm" },
    printBackground: true
  };
  
  // Generate PDF
  const file = { content: html };
  const pdfBuffer = await new Promise<Buffer>((resolve, reject) => {
    generatePdf(file, options, (err, buffer) => {
      if (err) reject(err);
      else resolve(buffer as Buffer);
    });
  });
  
  return pdfBuffer;
};