// Import pdf-parse at runtime to support both CommonJS and ESM builds.

export interface PdfExtractionResult {
  text: string;
  pageCount: number;
}

export async function extractTextFromPdf(fileBuffer: Buffer): Promise<PdfExtractionResult> {
  if (!fileBuffer || fileBuffer.length === 0) {
    throw new Error("PDF file is empty.");
  }

  try {
    const pdfModule = await import("pdf-parse");
    const pdfParse = (pdfModule as any).default ?? pdfModule;
    const data = await pdfParse(fileBuffer);

    if (!data || typeof data.text !== "string" || data.text.trim().length === 0) {
      throw new Error("Unable to extract text from PDF. The file may be corrupt or contain no readable text.");
    }

    const pageCount = Number(data.numpages ?? 0);
    if (Number.isNaN(pageCount) || pageCount <= 0) {
      throw new Error("Unable to determine page count from PDF.");
    }

    return {
      text: data.text,
      pageCount,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to parse PDF: ${message}`);
  }
}
