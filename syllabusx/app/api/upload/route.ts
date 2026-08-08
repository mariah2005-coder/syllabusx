import { NextRequest, NextResponse } from "next/server";
import { extractTextFromPdf } from "../../../lib/pdf";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request: NextRequest) {
  const contentType = request.headers.get("content-type") || "";

  if (!contentType.includes("multipart/form-data")) {
    return jsonError("Request must be multipart/form-data with a PDF file.");
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!file || !(file instanceof File)) {
    return jsonError("No file uploaded. Please attach a PDF file under the 'file' field.");
  }

  if (file.type !== "application/pdf") {
    return jsonError("Uploaded file must be a PDF.");
  }

  if (file.size === 0) {
    return jsonError("Uploaded PDF is empty.");
  }

  if (file.size > MAX_FILE_SIZE) {
    return jsonError("PDF file must be smaller than 10MB.");
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const { text, pageCount } = await extractTextFromPdf(buffer);
    return NextResponse.json({ text, pageCount });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to parse PDF file.";
    return jsonError(message, 422);
  }
}
