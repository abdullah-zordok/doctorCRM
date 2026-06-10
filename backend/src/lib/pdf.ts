import type { Response } from "express";
import PDFDocument from "pdfkit";

export async function createPdfBuffer(builder: (document: PDFKit.PDFDocument) => void) {
  const document = new PDFDocument({ margin: 48, size: "A4", compress: false });
  const chunks: Buffer[] = [];

  const bufferPromise = new Promise<Buffer>((resolve, reject) => {
    document.on("data", (chunk) => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));
    document.on("end", () => resolve(Buffer.concat(chunks)));
    document.on("error", reject);
  });

  builder(document);
  document.end();

  return bufferPromise;
}

export function sendPdfResponse(res: Response, filename: string, buffer: Buffer) {
  return res
    .status(200)
    .setHeader("Content-Type", "application/pdf")
    .setHeader("Content-Disposition", `inline; filename="${filename}"`)
    .setHeader("Content-Length", String(buffer.length))
    .send(buffer);
}
