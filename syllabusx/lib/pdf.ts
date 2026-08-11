import { extractText, getDocumentProxy } from "unpdf";

export interface PdfExtractionResult {
  text: string;
  pageCount: number;
}

export async function extractTextFromPdf(fileBuffer: Buffer): Promise<PdfExtractionResult> {
  if (!fileBuffer || fileBuffer.length === 0) {
    throw new Error("PDF file is empty.");
  }

  try {
    const uint8Array = new Uint8Array(fileBuffer);
    const pdf = await getDocumentProxy(uint8Array);
    const { text, totalPages } = await extractText(pdf, { mergePages: true });

    if (!text || text.trim().length === 0) {
      throw new Error("Unable to extract text from PDF. The file may be corrupt or contain no readable text.");
    }

    return {
      text,
      pageCount: totalPages,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to parse PDF: ${message}`);
  }
}